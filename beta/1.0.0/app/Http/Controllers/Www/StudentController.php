<?php

    namespace App\Http\Controllers\Www;

    use App\Classes;
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
            $this->middleware('belongsToSchool');
        }

        /**
         * Display a listing of the resource.
         *
         * @return \Illuminate\Http\Response
         */
        public function index()
        {
            //
        }

        /**
         * Show the form for creating a new resource.
         *
         * @return \Illuminate\Http\Response
         */
        public function create()
        {
            $schools = \Auth::user()->schools->lists('name', 'id');
            //$classes= Auth::user()->schools()->classes->list('name','id');
            /*$classes = Classes::whereHas('school', function($q)
            {
                $q->where('school_id','=','1');

            })->get();*/
            $classes = \DB::table('classes')->whereIn('school_id',\Auth::user()->schools->lists('id'))->lists('name','id');
            return view('students.create')->with(compact('schools', 'classes'));
        }

        /**
         * Store a newly created resource in storage.
         *
         * @return \Illuminate\Http\Response
         */
        public function store(Requests\StoreStudentRequest $request)
        {
            Student::create($request->all());
            Flash::success('L’élève ' . $request->first_name . ' ' . $request->last_name . ' a été crée avec succès.');

            return redirect()->action('Www\PageController@dashboard');
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
            //
        }
    }
