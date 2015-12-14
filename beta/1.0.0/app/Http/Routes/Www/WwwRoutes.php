<?php

    Route::get('planificate/one', 'Www\PresentController@getPlanificateStepOne');
    Route::post('planificate/one', 'Www\PresentController@storePlanificateStepOne');
    Route::get('planificate/two', 'Www\PresentController@getPlanificateStepTwo');
    Route::post('planificate/two', 'Www\PresentController@storePlanificateStepTwo');
    Route::get('planificate/three', 'Www\PresentController@getPlanificateStepThree');
    Route::post('planificate/three', 'Www\PresentController@storePlanificateStepThree');
    Route::get('planificate/summary', 'Www\PresentController@getPlanificateStepFour');
    Route::post('planificate/end', 'Www\PresentController@storePlanification');

    Route::get('planificate', 'Www\PresentController@getPlanificateFull');
    Route::get('planificate/{cours_slug}', 'Www\PresentController@getPlanificateFullWithCours');
    Route::post('planificate', 'Www\PresentController@storePlanificateFull');

    Route::get('classe/{id}/students', 'Www\StudentController@getStudentFromClasse');
    // search

    //Route::get('recherche/{therm}','Www\SearchController@mainSearch');
    Route::get('recherche', 'Www\SearchController@mainSearch');
    Route::get('pas-de-resultats', 'Www\SearchController@notFoundSearch');

    Route::get('/', ['middleware' => 'auth', 'uses' => 'Www\PageController@dashboard']);
    Route::get('teacher/{school_slug}/{user_slug}', ['middleware' => 'auth', 'uses' => 'Www\UserController@show']);
    Route::get('/school/config/', ['middleware' => 'auth', 'uses' => 'Www\SchoolController@getConfig']);
    Route::get('/teacher/config/', 'Www\UserController@getConfig');
    Route::post('store-note', 'Www\StudentController@storeNote');
    Route::get('student-import', 'Www\StudentController@getImportStudentsList');
    Route::get('add-student-to-classe/{classe_slug}','Www\ClassController@getAddStudentToClass');
    Route::post('student-import-store', 'Www\StudentController@importStudentsList');
    Route::post('student-import-to-classe-store/{classe_slug}', 'Www\ClassController@importStudentToClasse');
    Route::post('student-add-to-classe-store/{classe_slug}', 'Www\ClassController@addStudentToClasse');
    Route::resource('classe', 'Www\ClassController');
    Route::resource('student', 'Www\StudentController');
    Route::resource('school', 'Www\SchoolController');
    Route::resource('room', 'Www\RoomController');
    Route::resource('cours', 'Www\CoursController');
    Route::resource('present', 'Www\PresentController');
    Route::resource('teacher', 'Www\UserController');
    Route::get('prendre-les-presences/{id}', 'Www\PresentController@getAllStudentfromOneOccurrence');
    Route::post('prendre-les-presences/', 'Www\PresentController@storeClassePresent');
    Route::get('room/{school_slug}/{room_slug}', 'Www\RoomController@show');
// Authentication routes...
    Route::get('auth/login', 'Auth\AuthController@getLogin');
    Route::post('auth/login', 'Auth\AuthController@postLogin');
    Route::get('auth/logout', 'Auth\AuthController@getLogout');
// Registration routes...
    Route::get('auth/register', 'Auth\AuthController@getRegister');
    Route::post('auth/register', 'Auth\AuthController@postRegister');
// Password reset link request routes...
    Route::get('password/email', 'Auth\PasswordController@getEmail');
    Route::post('password/email', 'Auth\PasswordController@postEmail');

// Password reset routes...
    Route::get('password/reset/{token}', 'Auth\PasswordController@getReset');
    Route::post('password/reset', 'Auth\PasswordController@postReset');