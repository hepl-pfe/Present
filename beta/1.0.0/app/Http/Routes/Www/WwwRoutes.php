<?php

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
    Route::get('/groups', function () {
        return view('teacher.groups_index');
    });
    Route::get('/places', function () {
        return view('places.places_index');
    });
    Route::get('places/b12', function () {
        return view('places.places');
    });
    Route::get('/ajouter/cours', function () {
        return view('cours.create');
    });
    Route::get('/', ['middleware' => 'auth', 'uses' => 'Www\PageController@dashboard']);
    Route::get('teacher/{slug}',['middleware' => 'auth', 'uses' => 'Www\UserController@show']);
    Route::get('/schools/config/',['middleware' => 'auth', 'uses' => 'Www\SchoolController@getConfig']);
    Route::get('/schools/addUserToSchool/{id}',['middleware' => 'auth', 'uses' => 'Www\UserController@addUserToSchool']);
    Route::get('/colleagues',['middleware' => 'auth', 'uses' =>'Www\UserController@index']);
    Route::resource('class', 'Www\ClassController');
    Route::resource('student', 'Www\StudentController');
    Route::resource('school', 'Www\SchoolController');
    Route::resource('room','Www\RoomController');
// Authentication routes...
    Route::get('auth/login', 'Auth\AuthController@getLogin');
    Route::post('auth/login', 'Auth\AuthController@postLogin');
    Route::get('auth/logout', 'Auth\AuthController@getLogout');
// Registration routes...
    Route::get('auth/register', 'Auth\AuthController@getRegister');
    Route::post('auth/register', 'Auth\AuthController@postRegister');