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
                $schools = \Auth::user()->schools;
                $view->with(compact('user', 'schools'));
            });
            View::composer('teacher.dashboard', function ($view) {
                $students = \Auth::user()->students()->paginate(3);
                $view->with(compact('students'));
            });

            View::composer('schools.config', function ($view) {
                $all_schools = School::all('name', 'slug', 'id');
                $view->with(compact('all_schools'));
            });

            View::composer('forms.class.create', function ($view) {
                $schools = \Auth::user()->schools->lists('name', 'id');
                $classes = \Auth::user()->classes->lists('name', 'id');
                $view->with(compact('schools', 'classes'));
            });
            View::composer('forms.students.create', function ($view) {
                $classes = \Auth::user()->classes->lists('name', 'id');
                $schools = \Auth::user()->schools->lists('name', 'id');
                $view->with(compact('classes', 'schools'));
            });
            View::composer('forms.seances.create_full_seance', function ($view) {
                $class = \Auth::user()->classes->lists('name', 'id');
                $cours = \Auth::user()->cours->lists('name', 'id');
                $schools = \Auth::user()->schools->lists('name', 'id');
                $view->with(compact('class', 'schools','cours'));
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
