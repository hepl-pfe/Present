<?php

    namespace App\Providers;

    use App\School;
    use App\User;
    use Illuminate\Pagination\Paginator;
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
            View::composer('modals.dashbord.students', function ($view) {
                $students = \Auth::user()->students()->paginate(3, ['*'], 'more_student');
                $view->with(compact('students'));
            });
            View::composer('modals.dashbord.classes', function ($view) {
                $classes = \Auth::user()->classes()->paginate(3, ['*'], 'more_classe');
                $view->with(compact('classes'));
            });
            View::composer('modals.dashbord.cours', function ($view) {
                $cours = \Auth::user()->cours()->paginate(3, ['*'], 'more_cours');
                $view->with(compact('cours'));
            });
            View::composer('modals.dashbord.planning', function ($view) {
                $isAllowToPlannificate = (empty(!\Auth::user()->cours->toArray()) && empty(!\Auth::user()->classes->toArray()));
                $occurrences=\Auth::user()->occurrences()->paginate(3, ['*'], 'seances');
                $view->with(compact('isAllowToPlannificate','occurrences'));
            });
            View::composer('cours.index', function ($view) {
                $cours = \Auth::user()->cours()->paginate(6);
                $view->with(compact('cours'));
            });
            View::composer('students.index', function ($view) {
                $students = \Auth::user()->students()->paginate(6);
                $view->with(compact('students'));
            });
            View::composer('classe.index', function ($view) {
                $classes = \Auth::user()->classes()->paginate(6);
                $view->with(compact('classes'));
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
                $classes = \Auth::user()->classes;
                $cours = \Auth::user()->cours->lists('name', 'id');
                $schools = \Auth::user()->schools->lists('name', 'id');
                $view->with(compact('classes', 'schools', 'cours'));
            });
            View::composer('seances.create_full_seance', function ($view) {
                $hasCours = empty(!\Auth::user()->cours->toArray());
                $hasClasses = empty(!\Auth::user()->classes->toArray());
                $isAllowToPlannificate = ($hasCours && $hasClasses);
                $view->with(compact('hasClasses', 'hasCours', 'isAllowToPlannificate'));
            });
            View::composer('seances.index', function ($view) {
                $occurrences = \Auth::user()->occurrences()->FromToday()->paginate(6);
                $view->with(compact('occurrences'));
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
