<?php

namespace App\Providers;
use App\School;
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
            $view->with('user',\Auth::user());
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
