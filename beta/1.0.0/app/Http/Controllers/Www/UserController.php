<?php

    namespace App\Http\Controllers\Www;

    use App\School;
    use App\User;
    use Illuminate\Http\Request;

    use App\Http\Requests;
    use App\Http\Controllers\Controller;

    class UserController extends Controller
    {
        /**
         * Display a listing of the resource.
         *
         * @return \Illuminate\Http\Response
         */
        public function index()
        {
            //\Auth::user()->school()->users()->get();
            $user=\Auth::user();
            $school_id= $user->school_id;
            $data['collegues']=School::findOrfail($school_id)->users()->where('id','!=',$user->getAuthIdentifier())->get();
            $data['isBelongToSchool']=User::IsBelongToSchool();
            return view('teacher.teachers_index')->with('data',$data);
        }

        /**
         * Show the form for creating a new resource.
         *
         * @return \Illuminate\Http\Response
         */
        public function create()
        {
            //
        }

        /**
         * Store a newly created resource in storage.
         *
         * @param  \Illuminate\Http\Request $request
         *
         * @return \Illuminate\Http\Response
         */
        public function store(Request $request)
        {
            //
        }

        /**
         * Display the specified resource.
         *
         * @param  string $slug
         *
         * @return \Illuminate\Http\Response
         */
        public function show($slug)
        {
            $user = app('App\Http\Controllers\Api\UserController')->show($slug);
            if (\Auth::user()->slug == $slug) {
                return view('teacher.config', compact('user'));
            }

            return view('teacher.show', compact('user'));
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
