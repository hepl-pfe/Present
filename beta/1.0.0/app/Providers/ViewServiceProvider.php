<?php

namespace App\Providers;
use App\School;
use App\User;
use View;
use Illuminate\Support\ServiceProvider;

class ViewServiceProvider extends ServiceProvider
{
    /**
     * Bootstrap the application services.
     *
     * @return void
     */
    public function boot()
    {
        View::composer('partials.panel.teacher_controller', function($view)
        {
            $data['user']=\Auth::user();
            $data['school']=\Auth::user()->school()->get()->first();
            $view->with('userData',$data);
        });
        View::composer('schools.config', function($view)
        {
            $view->with('schools', School::all('name', 'id'));
        });
    }

    /**
     * Register the application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }
}
