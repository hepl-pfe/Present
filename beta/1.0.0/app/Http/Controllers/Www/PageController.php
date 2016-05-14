<?php

    namespace App\Http\Controllers\Www;

    use Barryvdh\Debugbar\DataCollector\AuthCollector;
    use Illuminate\Http\Request;

    use App\Http\Requests;
    use App\Http\Controllers\Controller;
    use Illuminate\Support\Facades\Auth;
    use Laracasts\Flash\Flash;

    class PageController extends Controller
    {
        public function __construct()
        {
            $this->middleware('auth');
        }

        public function dashboard()
        {
            return view('teacher.dashboard');
        }

        public function getConfig()
        {
            $colorTable = ['#1abc9c' => 'Turquoise',
                           '#e67e22' => 'Orange',
                           '#c0392b' => 'Rouge foncé',
                           '#8e44ad' => 'Mauve',
                           '#0933FF' => 'Bleu',
                           '#E34A78' => 'Rouge',
                           '#2FC85A' => 'Vert',
                           '#CDDC39' => 'Vert clair',
                           '#FFEB3B' => 'Jaune',
                           '#795548' => 'Brun'];
            $allColor=$colorTable;
            $userStatuts = Auth::user()->statuts;
            foreach ($userStatuts as $satut) {
                unset($colorTable[ $satut->color ]);
            }

            return view('configuration.config')->with(['colorTable' => $colorTable,'allColor' => $allColor]);
        }
    }
