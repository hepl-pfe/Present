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
            View::composer('layouts.teacher_layout', function ($view) {
                $user = \Auth::user();
                $school = \Auth::user()->schools();
                $view->with(compact('user','school'));
            });
            View::composer('schools.config', function ($view) {
                $all_schools = School::all('name', 'slug', 'id');
                $view->with(compact('all_schools'));
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
