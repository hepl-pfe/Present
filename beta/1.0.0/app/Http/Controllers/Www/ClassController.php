<?php

    namespace App\Http\Controllers\Www;

    use App\Classe;
    use App\Http\Controllers\Api\StudentController;
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
            return view('class.index')->with('classes', \Auth::user()->classes);
        }

        /**
         * Show the form for creating a new resource.
         *
         * @return \Illuminate\Http\Response
         */
        public function create()
        {
            $students = \Auth::user()->students->lists('fullname', 'id');

            return view('class.create', compact('students'));
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
            ///
            $filePath = $request->file('csv')->getPathName();
            $this->importStudentsList($filePath,$classe);

            Flash::success('La classe a été créée avec succès.');

            return redirect()->action('Www\PageController@dashboard');
        }

        public function importStudentsList($studentsFilePath,$classe)
        {
            $import = Excel::load($studentsFilePath);
            $students = $import->get();

            foreach ($students as $studentrow) {
                $student =\Auth::user()->students()->create([
                    'first_name' => $studentrow->first_name,
                    'last_name'  => $studentrow->last_name,
                    'email'      => $studentrow->email
                ]);
                $classe->students()->attach($student);
            }

        }

        /**
         * Display the specified resource.
         *
         * @param  int $id
         *
         * @return \Illuminate\Http\Response
         */
        public function show($id)
        {
            //
        }

        /**
         * Show the form for editing the specified resource.
         *
         * @param  int $id
         *
         * @return \Illuminate\Http\Response
         */
        public function edit($id)
        {
            //
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
            //
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
