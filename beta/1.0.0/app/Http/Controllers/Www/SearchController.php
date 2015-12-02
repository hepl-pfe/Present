<?php

    namespace App\Http\Controllers\Www;

    use Illuminate\Http\Request;

    use App\Http\Requests;
    use App\Http\Controllers\Controller;
    use Illuminate\Support\Facades\Redirect;

    class SearchController extends Controller
    {
        /**
         * ClassController constructor.
         */
        public function __construct()
        {
            $this->middleware('auth');
        }

        public function mainSearch()
        {
            $query = \Input::get('search');
            if (!empty($query)) {
                $results = \Search::query($query)->get();
                if (!empty($results->toArray())) {
                    return view('search.results', compact('results'));
                }

                return \Redirect::action('Www\SearchController@notFoundSearch');
            }
            \Flash::error('Oups, vous avez oublié d’introduire votre recherche');

            return \Redirect::back();
        }

        public function notFoundSearch()
        {
            return view('search.not_found');
        }

        public function noQuerySearch()
        {
            return view('search.no_query');
        }

    }
