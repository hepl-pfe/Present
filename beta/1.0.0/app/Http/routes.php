<?php

    /*
    |--------------------------------------------------------------------------
    | Application Routes
    |--------------------------------------------------------------------------
    |
    | Here is where you can register all of the routes for an application.
    | It's a breeze. Simply tell Laravel the URIs it should respond to
    | and give it the controller to call when that URI is requested.
    |
    */

    //Route::resource('cours','CourController');
    //Route::resource('student','SutendController');

    Route::get('/', function () {
        return view('teacher.dashboard');
    });
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
    Route::get('teacher/config/blisntin-stephan', function () {
        return view('teacher.config');
    });
    Route::get('student/create', function () {
        return view('students.create');
    });
    Route::get('/ajouter/cours', function () {
        return view('cours.create');
    });

// Authentication routes...
    Route::get('auth/login', 'Auth\AuthController@getLogin');
    Route::post('auth/login', 'Auth\AuthController@postLogin');
    Route::get('auth/logout', 'Auth\AuthController@getLogout');

// Registration routes...
    Route::get('auth/register', 'Auth\AuthController@getRegister');
    Route::post('auth/register', 'Auth\AuthController@postRegister');

