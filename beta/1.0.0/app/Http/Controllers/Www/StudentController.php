<?php

    namespace App\Http\Controllers\Www;

    use App\Classes;
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
            $students= \Auth::user()->students;
            return view('students.index')->with(compact('students'));
        }

        /**
         * Show the form for creating a new resource.
         *
         * @return \Illuminate\Http\Response
         */
        public function create()
        {
            $classes= Auth::user()->classes->lists('name','id');
            $schools= Auth::user()->schools->lists('name','id');
            return view('students.create',compact('classes','schools'));
        }

        /**
         * Store a newly created resource in storage.
         *
         * @return \Illuminate\Http\Response
         */
        public function store(Requests\StoreStudentRequest $request)
        {
            $student= new Student($request->all());
            \Auth::user()->students()->save($student);
            $student->classes()->attach($request->classes_id);
            Flash::success('L’élève ' . $request->first_name . ' ' . $request->last_name . ' a été crée avec succès.');

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
            $student= Student::findBySlugOrFail($slug);
            $notes= $student->notes;
            return view('students.student',compact('student','notes'));
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
            //
        }

        public function storeNote(Requests\StoreNoteRequest $request)
        {
            $note= new Note($request->all());
            \Auth::user()->notes()->save($note);

            \Flash::success('la note a été ajouté avec succès.');
            return \Redirect::back();
        }

        public function getImportStudentsList()
        {
            return view('students.import');
        }

        public function importStudentsList(Requests\ImportStudentsList $import)
        {
            $students=$import->get();
            foreach($students as $studentrow){
                echo($studentrow->prenom);
            }
            dd('sss');
        }
    }
