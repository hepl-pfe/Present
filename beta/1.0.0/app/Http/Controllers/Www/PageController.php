<?php

namespace App\Http\Controllers\Www;

use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Laracasts\Flash\Flash;

class PageController extends Controller
{
    public function dashboard()
    {
        return view('teacher.dashboard')->with('user',\Auth::user());
    }
}
