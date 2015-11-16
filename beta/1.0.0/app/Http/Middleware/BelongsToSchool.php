<?php

namespace App\Http\Middleware;

use App\User;
use Closure;

class BelongsToSchool
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle($request, Closure $next)
    {
        if(! User::IsBelongToSchool()){
            \Session::flash('flash_message','Oups, vous devez faire une demande  d’adhésion à une école ou créer la vôtre.');
            return redirect()->action('Www\SchoolController@getConfig');
        }
        return $next($request);
    }
}
