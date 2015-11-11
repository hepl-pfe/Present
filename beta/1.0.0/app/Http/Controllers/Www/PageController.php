<?php

namespace App\Http\Controllers\Www;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;

class PageController extends Controller
{
    public function dashboard()
    {
        //\Session::flash('flash_message','Votre cours de Français commence dans 2 minutes.');
        return view('teacher.dashboard');
    }
}
