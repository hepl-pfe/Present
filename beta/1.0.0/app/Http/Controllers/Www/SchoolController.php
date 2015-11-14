<?php

    namespace App\Http\Controllers\Www;

    use App\School;
    use Illuminate\Http\Request;

    use App\Http\Requests;
    use App\Http\Controllers\Controller;
    use Illuminate\Support\Facades\Auth;

    class SchoolController extends Controller
    {
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
            return view('schools.create');
        }

        /**
         * Store a newly created resource in storage.
         *
         * @param  \Illuminate\Http\Request $request
         *
         * @return \Illuminate\Http\Response
         */
        public function store(Requests\StoreSchoolRequest $request)
        {
            School::create($request->all());

            return redirect('schools/config');
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

        public function getConfig()
        {
            return view('schools.config');
        }

        public function addUserToSchool($id)
        {
            $school = School::where('id', '=', $id)->get();
            if (!!count($school)) {
                \DB::table('users')
                    ->where('id', \Auth::user()->getAuthIdentifier())
                    ->update(array('school_id' => $id));
               \Session::flash('flash_message','Merci, '. \Auth::user()->first_name .' votre demande d’adhésion à l’école "'.$school->first()->name.'" est en cour de validation.');
            }

            return \Redirect::back();
        }

    }
