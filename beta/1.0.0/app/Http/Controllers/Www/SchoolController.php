<?php

    namespace App\Http\Controllers\Www;

    use App\School;
    use Illuminate\Http\Request;

    use App\Http\Requests;
    use App\Http\Controllers\Controller;
    use Illuminate\Support\Facades\Auth;
    use Laracasts\Flash\Flash;

    class SchoolController extends Controller
    {
        /**
         * Display a listing of the resource.
         *
         * @return \Illuminate\Http\Response
         */
        public function index()
        {
            $schools = \Auth::user()->schools;
            if (is_null($schools)) {
                return \Redirect::back();
            }

            return view('schools.index')->with(compact('schools'));
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
            $school = new School($request->all());
            \Auth::user()->schools()->save($school);
            Flash::success('L’école vient d’être créée avec succès.');

            return redirect()->action('Www\SchoolController@getConfig');
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
            School::destroy($id);
            Flash::success('L’école vient d’etre supprimé.');

            return \Redirect::back();
        }

        public function getConfig()
        {
            return view('schools.config');
        }
    }
