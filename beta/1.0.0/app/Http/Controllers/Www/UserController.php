<?php

    namespace App\Http\Controllers\Www;

    use App\Cour;
    use App\Occurrence;
    use App\School;
    use App\User;
    use Carbon\Carbon;
    use Illuminate\Http\Request;

    use App\Http\Requests;
    use App\Http\Controllers\Controller;
    use Illuminate\Support\Facades\Redirect;

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

        public function getPlanificateStepOne()
        {
            return view('teacher.tunnel.planificateCours.list_schools')->with('schools', \Auth::user()->schools->lists('name', 'id'));
        }

        public function storePlanificateStepOne(Request $request)
        {
            \Session::put('schools_id', $request->input('schools_id'));

            return redirect()->action('Www\UserController@getPlanificateStepTwo');
        }

        public function getPlanificateStepTwo()
        {
            return view('teacher.tunnel.planificateCours.list_cours')->with('cours', \Auth::user()->cours->lists('name', 'id'));
        }

        public function storePlanificateStepTwo(Request $request)
        {

            \Session::put('cours_id', $request->input('cours_id'));

            return redirect()->action('Www\UserController@getPlanificateStepThree');
        }

        public function getPlanificateStepThree()
        {
            return view('teacher.tunnel.planificateCours.list_class')->with('class', \Auth::user()->classes->lists('name', 'id'));
        }

        public function storePlanificateStepThree(Request $request)
        {
            \Session::put('classes_id', $request->input('classes_id'));

            return redirect()->action('Www\UserController@getPlanificateStepFour');
        }

        public function getPlanificateStepFour()
        {
            return view('teacher.tunnel.planificateCours.summary')->with('session', \Session::all());
        }

        public function storePlanification(Request $request)
        {
            dd($request->all());
            Occurrence::create([
                'cour_id' => \Session::get('cours_id')[0]
            ]);
            \Flash::success('La planification é été créer avec succès.');

            return redirect()->action('Www\PageController@dashboard');
        }

        public function getPlanificateFull()
        {
            $class = \Auth::user()->classes->lists('name', 'id');
            $cours = \Auth::user()->cours->lists('name', 'id');
            $schools = \Auth::user()->schools->lists('name', 'id');

            return view('teacher.planificate', compact('class', 'cours', 'schools'));
        }

        public function getPlanificateFullWithCours($cours_slug)
        {
            $class = \Auth::user()->classes->lists('name', 'id');
            $cours = \Auth::user()->cours->lists('name', 'id');
            $schools = \Auth::user()->schools->lists('name', 'id');
            $cour = Cour::findBySlugOrIdOrFail($cours_slug);

            return view('teacher.planificate', compact('class', 'cours', 'schools', 'cour'));
        }

        public function storePlanificateFull(Requests\storeFullPlanification $request)
        {

            $start_period = new Carbon($request->from);
            $end_period = new Carbon($request->to);
            $day = $request->day;
            $cour = Cour::findBySlugOrIdOrFail($request->cour_id);
            while ($start_period->lte($end_period)) {
                if ($start_period->dayOfWeek == $day) {
                    \Auth::user()->occurrences()->save(
                        new Occurrence([
                            'from'      => $start_period,
                            'to'        => $end_period,
                            'day'       => $request->day,
                            'from_hour' => $request->from_hour,
                            'to_hour'   => $request->to_hour,
                            'cour_id'   => $request->cour_id,
                            'classe_id' => $request->classe_id,
                        ])
                    );
                }
                $start_period->addDay(1);
            }
            // bind cours to classe
            $cour->classes()->attach($request->classe_id);
            \Flash::success('La planification de la séance a été créée avec succès.');

            return redirect()->action('Www\PageController@dashboard');
        }
    }
