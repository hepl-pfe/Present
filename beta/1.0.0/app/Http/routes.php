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
        return view('teacher.places_index');
    });
    Route::get('places/b12', function () {
        return view('teacher.places');
    });
    Route::get('teacher/config/blisntin-stephan', function () {
        return view('teacher.config');
    });
    Route::controllers([
        'auth' => 'Auth\AuthController',
        'password' => 'Auth\PasswordController',
    ]);
