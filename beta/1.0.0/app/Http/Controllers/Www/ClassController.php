<?php

    namespace App\Http\Controllers\Www;

    use App\Classe;
    use App\Student;
    use Illuminate\Http\Request;

    use App\Http\Requests;
    use App\Http\Controllers\Controller;
    use Laracasts\Flash\Flash;
    use Maatwebsite\Excel\Facades\Excel;

    class ClassController extends Controller
    {
        /**
         * ClassController constructor.
         */
        public function __construct()
        {
            $this->middleware('auth');
        }

        /**
         * Display a listing of the resource.
         *
         * @return \Illuminate\Http\Response
         */
        public function index()
        {
            return view('classe.index')->with('classes', \Auth::user()->classes);
        }

        /**
         * Show the form for creating a new resource.
         *
         * @return \Illuminate\Http\Response
         */
        public function create()
        {
            $students = \Auth::user()->students->lists('fullname', 'id');

            return view('classe.create', compact('students'));
        }

        /**
         * Store a newly created resource in storage.
         *
         * @param  \Illuminate\Http\Request $request
         *
         * @return \Illuminate\Http\Response
         */
        public function store(Requests\StoreClassRequest $request)
        {
            $classe = new Classe($request->all());
            \Auth::user()->classes()->save($classe);
            $classe->students()->attach($request->students_id);
            if (!is_null(\Input::file('csv'))) {
                $filePath = $request->file('csv')->getPathName();
                $this->importStudentsList($filePath, $classe);
            }

            Flash::success('La classe a été créée avec succès.');

            return redirect()->action('Www\PageController@dashboard');
        }

        public function importStudentsList($studentsFilePath, $classe)
        {
            $import = Excel::load($studentsFilePath);
            $students = $import->get();

            foreach ($students as $studentrow) {
                $student = \Auth::user()->students()->create([
                    'first_name' => $studentrow->first_name,
                    'last_name'  => $studentrow->last_name,
                    'email'      => $studentrow->email
                ]);
                $classe->students()->attach($student);
            }
            Flash::success('La classe a été créée avec succès et les élève ont été associés.');

            return redirect()->action('Www\PageController@dashboard');
        }

        /**
         * Display the specified resource.
         *
         * @param  int $$slug
         *
         * @return \Illuminate\Http\Response
         */
        public function show($slug)
        {
            $classe = Classe::findBySlugOrIdOrFail($slug);

            return view('classe.classe', compact('classe'));
        }

        /**
         * Show the form for editing the specified resource.
         *
         * @param  int $slug
         *
         * @return \Illuminate\Http\Response
         */
        public function edit($slug)
        {
            $students = \Auth::user()->students->lists('fullname', 'id');
            $classe = Classe::findBySlugOrIdOrFail($slug);

            return view('classe.edit', compact('classe', 'students'));
        }

        /**
         * Update the specified resource in storage.
         *
         * @param  \Illuminate\Http\Request $request
         * @param  int                      $id
         *
         * @return \Illuminate\Http\Response
         */
        public function update(Request $request, $id)
        {

            $classe = Classe::findBySlugOrIdOrFail($id);
            $classe->update($request->all());
            if (!is_null($request->students_id)) {
                $classe->students()->sync($request->students_id);
            }
            if (!is_null(\Input::file('csv'))) {
                $filePath = $request->file('csv')->getPathName();
                $this->importStudentsList($filePath, $classe);
            }

            Flash::success('La classe a été modifier avec succès.');

            return redirect()->action('Www\PageController@dashboard');
        }

        /**
         * Remove the specified resource from storage.
         *
         * @param  int $id
         *
         * @return \Illuminate\Http\Response
         */
        public function destroy($id)
        {
            Classe::destroy($id);
            Flash::success('La classe vient d’etre supprimé.');

            return \Redirect::back();
        }
    }
