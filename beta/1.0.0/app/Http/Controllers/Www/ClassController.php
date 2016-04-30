<?php

    namespace App\Http\Controllers\Www;

    use App\Classe;
    use App\Student;
    use Carbon\Carbon;
    use Illuminate\Http\Request;

    use App\Http\Requests;
    use App\Http\Controllers\Controller;
    use Illuminate\Pagination\Paginator;
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
            return view('classe.index');
        }

        /**
         * Show the form for creating a new resource.
         *
         * @return \Illuminate\Http\Response
         */
        public function create()
        {
            $schools = \Auth::user()->schools->lists('name', 'id');

            return view('classe.create', compact('schools'));
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
            $this->addOrImportStudentsToClasse($request,$classe->slug);
           /* $classe->students()->attach($request->students_id);
            if (!is_null(\Input::file('csv'))) {
                $filePath = $request->file('csv')->getPathName();
                $this->importStudentsList($filePath, $classe);
            }*/

            Flash::success('La classe, ' . $classe->name . ', a été créée avec succès.');

            return \Redirect::back();
        }

        public function importStudentToClasse(Requests\StoreStudentToClasse $request, $classe_slug)
        {
            $classe = Classe::findBySlugOrIdOrFail($classe_slug);
            $classe->students()->attach($request->students_id);
            if (!is_null(\Input::file('student_list'))) {
                $filePath = $request->file('student_list')->getPathName();
                $this->importStudentsList($filePath, $classe);
            }
            Flash::success('Les élèves ont été ajoutés avec succès à la classe ' . $classe->name);

            return redirect()->action('Www\PageController@dashboard');
        }

        public function getAddStudentToClass($slug)
        {
            $students = \Auth::user()->students->lists('fullname', 'id');
            $classe = Classe::findBySlugOrIdOrFail($slug);
            $selected_student = $classe->students->lists('id')->toArray();

            return view('classe.add_student_to_class', compact('classe', 'students', 'selected_student'));
        }

        public function addStudentToClasse(Requests\StoreStudentToClasse $request, $classe_slug)
        {
            $this->addOrImportStudentsToClasse($request, $classe_slug);

            Flash::success('Les élèves de la classe' . Classe::findBySlugOrIdOrFail($classe_slug)->name . ' ont été ajoutés avec succès à la classe ');

            return redirect()->action('Www\PageController@dashboard');
        }

        protected function addOrImportStudentsToClasse($request, $classe_slug)
        {
            $classe = Classe::findBySlugOrIdOrFail($classe_slug);
            if (!is_null($request->students_id)) {
                $classe->students()->sync($request->students_id);
            }
            if (!is_null(\Input::file('csv'))) {
                $filePath = $request->file('csv')->getPathName();
                $this->importStudentsList($filePath, $classe);
            }
            $classe->update(['updated_at'=>Carbon::now()]);
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
            Flash::success('La classe, ' . $classe->name . ', a été créée avec succès et les élève ont été associés.');

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
            $classe = Classe::findBySlugOrIdOrFail($slug);
            $selected_student = $classe->students()->orderBy('first_name','asc')->get()->lists('id')->toArray();
            $classes=\Auth::user()->classes()->orderBy('updated_at', 'desc')->where('id','!=',$classe->id)->paginate(4);
            return view('classe.edit', compact('selected_student','classe','classes'));
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
            $this->addOrImportStudentsToClasse($request,$classe->slug);
            
            Flash::success('La classe a été modifier avec succès.');

            return \Redirect::back();
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
            $classe = Classe::findBySlugOrIdOrFail($id);
            Flash::success('La classe, ' . $classe->name . ', vient d’etre supprimé.');
            Classe::destroy($id);

            return \Redirect::back();
        }
    }
