<?php

    Route::get('/cours', function () {
        return view('teacher.cours_index');
    });
    Route::get('/cours/français', function () {
        return view('teacher.cours');
    });
    Route::get('/eleves/blisntin-stephan', function () {
        return view('teacher.student_record');
    });
    Route::get('/groups', function () {
        return view('teacher.groups_index');
    });
    Route::get('/ajouter/cours', function () {
        return view('cours.create');
    });


    Route::get('planificate/one','Www\UserController@getPlanificateStepOne');
    Route::post('planificate/one','Www\UserController@storePlanificateStepOne');
    Route::get('planificate/two','Www\UserController@getPlanificateStepTwo');
    Route::post('planificate/two','Www\UserController@storePlanificateStepTwo');
    Route::get('planificate/three','Www\UserController@getPlanificateStepThree');
    Route::post('planificate/three','Www\UserController@storePlanificateStepThree');
    Route::get('planificate/summary','Www\UserController@getPlanificateStepFour');
    Route::post('planificate/end','Www\UserController@storePlanification');

    Route::get('planificate','Www\UserController@getPlanificateFull');
    Route::post('planificate','Www\UserController@storePlanificateFull');

    Route::get('/', ['middleware' => 'auth', 'uses' => 'Www\PageController@dashboard']);
    Route::get('teacher/{school_slug}/{user_slug}',['middleware' => 'auth', 'uses' => 'Www\UserController@show']);
    Route::get('/school/config/',['middleware' => 'auth', 'uses' => 'Www\SchoolController@getConfig']);
    Route::get('/teacher/config/','Www\UserController@getConfig');
    Route::get('/school/addUserToSchool/{id}',['middleware' => 'auth', 'uses' => 'Www\UserController@addUserToSchool']);
    Route::get('/colleagues',['middleware' => 'auth', 'uses' =>'Www\UserController@index']);
    Route::resource('classe', 'Www\ClassController');
    Route::resource('student', 'Www\StudentController');
    Route::resource('school', 'Www\SchoolController');
    Route::resource('room','Www\RoomController');
    Route::resource('cours','Www\CoursController');
    Route::resource('present','Www\PresentController');
    Route::get('prendre-les-presences/{id}','Www\PresentController@getAllStudentfromOneOccurrence');
    Route::get('room/{school_slug}/{room_slug}','Www\RoomController@show');
    Route::get('horaire','Www\UserController@getBindEventForm');
    Route::post('horaire','Www\UserController@storeBindEvent');
// Authentication routes...
    Route::get('auth/login', 'Auth\AuthController@getLogin');
    Route::post('auth/login', 'Auth\AuthController@postLogin');
    Route::get('auth/logout', 'Auth\AuthController@getLogout');
// Registration routes...
    Route::get('auth/register', 'Auth\AuthController@getRegister');
    Route::post('auth/register', 'Auth\AuthController@postRegister');