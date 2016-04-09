<?php

    namespace App\Http\Controllers\Www;

    use App\Statut;
    use Dingo\Api\Http\Middleware\Auth;
    use Illuminate\Http\Request;

    use App\Http\Requests;
    use App\Http\Controllers\Controller;
    use Illuminate\Support\Facades\Redirect;
    use Laracasts\Flash\Flash;

    class StatutController extends Controller
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
            return view('configuration.config');
        }

        /**
         * Show the form for creating a new resource.
         *
         * @return \Illuminate\Http\Response
         */
        public function create()
        {
            return view('configuration.config');
        }

        /**
         * Store a newly created resource in storage.
         *
         * @param  \Illuminate\Http\Request $request
         *
         * @return \Illuminate\Http\Response
         */
        public function store(Requests\StoreStatutRequest $request)
        {
            \Auth::user()->statuts()->create($request->all());
            \Flash::success('Le Statut ' . $request->name . ' a été créé avec succès.');

            return Redirect::back();
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
            return view('configuration.config');
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
            return view('configuration.config');
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
            $statut = Statut::findBySlugOrIdOrFail($id);
            $statut->update($request->all());
            \Flash::success('Le statut, ' . $statut->name . ', a été modifié avec succès.');

            return Redirect::back();
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
            $statut = Statut::findBySlugOrIdOrFail($id);
            if (\Auth::user()->statuts()->count() < 3) {
                Flash::error('Le statut, ' . $statut->name . ', ne peut pas être supprimé, car il faut au minimum 2 statuts.');
            } else {
                Flash::success('Le statut, ' . $statut->name . ', a été supprimé avec succès.');
                Statut::destroy($id);
            }

            return \Redirect::back();
        }
    }
