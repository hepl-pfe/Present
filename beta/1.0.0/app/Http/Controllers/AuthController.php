<?php

namespace App\Http\Controllers;

use App\AuthenticateUser;
use Illuminate\Http\Request;

use App\Http\Requests;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Session;

class AuthController extends Controller
{


    public function login(AuthenticateUser $authenticateUser,Request $request)
    {
        if(!is_null($request->driver)){
            \Session::put('driver',$request->driver);
        }
        return $authenticateUser->execute($request->has('code'),\Session::get('driver'));
    }
}
