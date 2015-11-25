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
            $schools = \Auth::user()->schools;

            return view('teacher.teachers_index')->with(compact('schools'));
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
         * @param  string $slug_user $slug_school
         *
         * @return \Illuminate\Http\Response
         */
        public function show($school_slug, $user_slug)
        {
            $user = School::findBySlugOrFail($school_slug)->users()->where('slug', '=', $user_slug)->firstOrFail();

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

        public function addUserToSchool($id)
        {
            if (!\Auth::user()->schools->contains($id)) {
                \Auth::user()->schools()->attach($id);
                Flash::success('Votre demande d’adhésion est en cours de traitement.');
            } else {
                Flash::error('Vous appartenez déjà à cette école');
            }

            return \Redirect::back();
        }

        public function getConfig()
        {
            return view('teacher.config')->with('user', \Auth::user());
        }

        public function getBindEventForm()
        {
            $cours = \Auth::user()->cours->lists('name', 'id');
            $classes = \DB::table('classes')->whereIn('school_id', \Auth::user()->schools->lists('id'))->lists('name', 'id');

            return view('teacher.bindEvent')->with(compact('cours', 'classes'));
        }

        public function storeBindEvent()
        {

        }

        public function getStarted($start_step)
        {
            if (!is_float($start_step)) {
                session(['start_step' => $start_step]);
            }else{
                \Flash::error('Oups, ce step n’est pas utilisé...');
            }
            return view('teacher.tunel.start');
        }

    }
