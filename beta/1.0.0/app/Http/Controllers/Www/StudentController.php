<?php

    namespace App\Http\Controllers\Www;

    use App\Classe;
    use App\Cour;
    use JavaScript;
    use App\Note;
    use App\Student;
    use Illuminate\Http\Request;

    use App\Http\Requests;
    use App\Http\Controllers\Controller;
    use Illuminate\Support\Facades\Auth;
    use Laracasts\Flash\Flash;

    class StudentController extends Controller
    {
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
            $students = \Auth::user()->students()->paginate(5);

            return view('students.index')->with(compact('students'));
        }

        /**
         * Show the form for creating a new resource.
         *
         * @return \Illuminate\Http\Response
         */
        public function create()
        {
            $classes = Auth::user()->classes->lists('name', 'id');
            $schools = Auth::user()->schools->lists('name', 'id');

            return view('students.create', compact('classes', 'schools'));
        }

        /**
         * Store a newly created resource in storage.
         *
         * @return \Illuminate\Http\Response
         */
        public function store(Requests\StoreStudentRequest $request)
        {
            $student = new Student($request->all());
            \Auth::user()->students()->save($student);
            $student->classes()->attach($request->classes_id);
            Flash::success('L’élève ' . $student->fullname . ' a été crée avec succès.');

            return redirect()->action('Www\PageController@dashboard');
        }

        /**
         * Display the specified resource.
         *
         * @param  int $slug
         *
         * @return \Illuminate\Http\Response
         */
        public function show($slug)
        {
            $student = Student::findBySlugOrIdOrFail($slug);
            $notes = $student->notes;
            JavaScript::put([
                "test" => 'mais oui je sais passer des valeur vers le javascript'
            ]);

            return view('students.student', compact('student', 'notes'));
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
            $student = Student::findBySlugOrIdOrFail($id);

            return view('students.edit', compact('student'));
        }

        /**
         * Update the specified resource in storage.
         *
         * @param  \Illuminate\Http\Request $request
         * @param  int                      $slug
         *
         * @return \Illuminate\Http\Response
         */
        public function update(Request $request, $slug)
        {
            $student = Student::findBySlugOrIdOrFail($slug);
            $student->update($request->all());
            \Flash::success('L’élève ' . $student->fullname . 'vient d’être modifié avec succès');

            return redirect()->action('Www\StudentController@show', ['slug' => $student->slug]);
        }

        /**
         * Remove the specified resource from storage.
         *
         * @param  int $id
         *
         * @return \Illuminate\Http\Response
         */
        public function destroy(Request $request)
        {
            $student=Student::findBySlugOrIdOrFail($request->student_id);
            Flash::success('L’élève, '.$student->fullname.' vient d’etre supprimé.');
            Student::destroy($request->student_id);
            if(isset($request->redirect_back)){
                if($request->redirect_back==1){
                    return \Redirect::back();
                }
            }
            return \Redirect::action('Www\StudentController@index');
        }

        public function storeNote(Requests\StoreNoteRequest $request)
        {
            $note = new Note($request->all());
            \Auth::user()->notes()->save($note);

            \Flash::success('La note a été ajouté avec succès.');

            return \Redirect::back();
        }

        public function getImportStudentsList()
        {
            return view('students.import');
        }

        public function importStudentsList(Requests\ImportStudentsList $import)
        {
            $students = $import->get();
            foreach ($students as $studentrow) {
                \Auth::user()->students()->create([
                    'first_name' => $studentrow->first_name,
                    'last_name'  => $studentrow->last_name,
                    'email'      => $studentrow->email
                ]);
            }
            \Flash::success('Vos élèves ont été importés avec succès.');

            return \Redirect::action('Www\StudentController@index');
        }

        public function getStudentFromClasse($id)
        {
            return Classe::findBySlugOrIdOrFail($id)->students;
        }
    }
