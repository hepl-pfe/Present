<?php

    namespace App\Http\Controllers\Www;

    use App\Cour;
    use App\Occurrence;
    use App\School;
    use Illuminate\Http\Request;

    use App\Http\Requests;
    use App\Http\Controllers\Controller;
    use Laracasts\Flash\Flash;

    class CoursController extends Controller
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
            $cours = \Auth::user()->cours;
            $occurrences = Occurrence::all();

            return view('cours.index', compact('cours', 'occurrences'));

        }

        /**
         * Show the form for creating a new resource.
         *
         * @return \Illuminate\Http\Response
         */
        public function create()
        {
            $schools = \Auth::user()->schools->lists('name', 'id');
            $classes = \Auth::user()->classes->lists('name', 'id');

            return view('cours.create')->with(compact('schools', 'classes'));
        }

        /**
         * Store a newly created resource in storage.
         *
         * @param  \Illuminate\Http\Request $request
         *
         * @return \Illuminate\Http\Response
         */
        public function store(Requests\StoreCoursRequest $request)
        {
            $cour = new Cour($request->all());
            \Auth::user()->cours()->save($cour);
            $cour->classes()->attach($request->classes_id);
            Flash::success('Le cours ' . $cour->name . 'a été créée avec succès.');
            if (session('start_step') == 2) {
                return redirect()->action('Www\UserController@getStarted', ['start_step' => 3]);
            }

            return redirect()->action('Www\CoursController@index');
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
            $cours = \Auth::user()->cours()->where('slug', '=', $slug)->firstOrfail();

            return view('cours.cours')->with(compact('cours'));
        }

        /**
         * Show the form for editing the specified resource.
         *
         * @param  int $id
         *
         * @return \Illuminate\Http\Response
         */
        public function edit(Cour $cour)
        {
            $schools = \Auth::user()->schools->lists('name', 'id');
            $classes = \Auth::user()->classes->lists('name', 'id');

            return view('cours.edit', compact('schools', 'classes', 'cour'));
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
            dd('On met à jours');
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
            Cour::destroy($id);
            Flash::success('Le cours vient d’etre supprimé.');

            return \Redirect::back();
        }
    }
