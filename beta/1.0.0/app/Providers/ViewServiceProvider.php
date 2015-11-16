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
                $data['user'] = \Auth::user();
                $data['school'] = \Auth::user()->school()->get()->first();
                $view->with('userData', $data);
            });
            View::composer('schools.config', function ($view) {
                $data['belongs_to_a_school']=false;
                $data['all_schools']=School::all('name','slug','id');
                $view->with('data',$data);
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
