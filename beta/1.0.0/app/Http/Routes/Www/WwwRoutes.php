<?php
    Route::get('/', ['middleware' => 'auth', 'uses' => 'Www\PageController@dashboard']);

    Route::get('/cours', function () {
        return view('teacher.cours_index');
    });
    Route::get('/cours/français', function () {
        return view('teacher.cours');
    });
    Route::get('/eleves', function () {
        return view('teacher.students_index');
    });
    Route::get('/eleves/blisntin-stephan', function () {
        return view('teacher.student_record');
    });
    Route::get('/teachers', function () {
        return view('teacher.teachers_index');
    });
    Route::get('/teachers/blisntin-stephan', function () {
        return view('teacher.teacher_record');
    });
    Route::get('/groups', function () {
        return view('teacher.groups_index');
    });
    Route::get('/places', function () {
        return view('places.places_index');
    });
    Route::get('places/b12', function () {
        return view('places.places');
    });
    Route::get('student/create', function () {
        return view('students.create');
    });
    Route::get('/ajouter/cours', function () {
        return view('cours.create');
    });
    Route::get('teacher/{slug}', 'Www\UserController@show');
    Route::resource('student', 'Www\StudentController');
    Route::resource('school', 'Www\SchoolController');
    Route::get('/schools/config/', 'Www\SchoolController@getConfig');
    Route::get('/schools/addUserToSchool/{id}', 'Www\SchoolController@addUserToSchool');
    Route::get('/colleagues','Www\UserController@index');
// Authentication routes...
    Route::get('auth/login', 'Auth\AuthController@getLogin');
    Route::post('auth/login', 'Auth\AuthController@postLogin');
    Route::get('auth/logout', 'Auth\AuthController@getLogout');
// Registration routes...
    Route::get('auth/register', 'Auth\AuthController@getRegister');
    Route::post('auth/register', 'Auth\AuthController@postRegister');