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

    Route::get('/school/register', function () {
        return view('visitors.home');
    });
    Route::get('/user/login', function () {
        return view('visitors.login');
    });

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
        return view('student.student_record');
    });

