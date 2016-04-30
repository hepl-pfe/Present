<?php

    namespace App\Providers;

    use App\School;
    use App\Student;
    use App\User;
    use Dingo\Api\Http\Middleware\Request;
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
            view()->composer('teacher.*', function ($view) {
                $nav = 'dashboard';
                $view->with(compact('nav'));
            });
            view()->composer('cours.*', function ($view) {
                $nav = 'cours';
                $view->with(compact('nav'));
            });
            view()->composer('students.*', function ($view) {
                $nav = 'students';
                $view->with(compact('nav'));
            });
            view()->composer('classe.*', function ($view) {
                $nav = 'classes';
                $view->with(compact('nav'));
            });
            view()->composer('configuration.*', function ($view) {
                $nav = 'config';
                $view->with(compact('nav'));
            });
            view()->composer('schools.*', function ($view) {
                $nav = 'schools';
                $view->with(compact('nav'));
            });
            view()->composer('seances.*', function ($view) {
                $nav = 'seances';
                $view->with(compact('nav'));
            });
            view()->composer('search.*', function ($view) {
                $nav = 'dashboard';
                $view->with(compact('nav'));
            });

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
                $occurrences = \Auth::user()->occurrences()->paginate(10, ['*'], 'seances');
                $view->with(compact('isAllowToPlannificate', 'occurrences'));
            });
            View::composer('cours.index', function ($view) {
                $cours = \Auth::user()->cours()->orderBy('slug', 'asc')->paginate(6);
                $view->with(compact('cours'));
            });

            View::composer('cours.create', function ($view) {
                $cours = \Auth::user()->cours()->orderBy('updated_at', 'desc')->paginate(4);
                $view->with(compact('cours'));
            });
            View::composer('students.index', function ($view) {
                $students = \Auth::user()->students()->orderBy('slug', 'asc')->paginate(8);
                $view->with(compact('students'));
            });
            View::composer('students.create', function ($view) {
                $students = \Auth::user()->students()->orderBy('updated_at', 'desc')->paginate(4);
                $view->with(compact('students'));
            });
            View::composer('classe.index', function ($view) {
                $classes = \Auth::user()->classes()->paginate(6);
                $view->with(compact('classes'));
            });
            View::composer('classe.create', function ($view) {
                $classes = \Auth::user()->classes()->orderBy('updated_at', 'desc')->paginate(4);
                $view->with(compact('classes'));
            });
            View::composer('configuration.config', function ($view) {
                $user = \Auth::user();
                $all_schools = School::all('name', 'slug', 'id');
                $view->with(compact('all_schools', 'user'));
            });
            View::composer('forms.class.create', function ($view) {
                $schools = \Auth::user()->schools->lists('name', 'id');
                $students = \Auth::user()->students()->alphabetic()->get()->lists('fullname', 'id');
                $view->with(compact('schools', 'classes', 'students'));
            });
            View::composer('forms.class.edit', function ($view) {
                $schools = \Auth::user()->schools->lists('name', 'id');
                $students = \Auth::user()->students()->alphabetic()->get()->lists('fullname', 'id');
                $view->with(compact('schools', 'students'));
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
                $occurrences = \Auth::user()->occurrences()->orderBy('id', 'desc')->paginate(3);
                $view->with(compact('occurrences'));
            });
            View::composer('modals.config.present-status', function ($view) {
                $statuts = \Auth::user()->statuts()->oderByDefault()->get();
                $view->with(compact('statuts'));
            });
            View::composer('forms.statuts.update-default', function ($view) {
                $statuts = \Auth::user()->statuts()->oderByDefault()->get();
                $view->with(compact('statuts'));
            });
            View::composer('emails.user-verification', function ($view) {
                $user = \Auth::user();
                $view->with(compact('user'));
            });
        }

        /**
         * Register the application services.
         *
         * @return void
         */
        public function register()
        {

        }
    }