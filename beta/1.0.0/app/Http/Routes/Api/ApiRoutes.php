<?php
    Route::resource('user','Api\UserController');
    Route::resource('student','Api\StudentController');
    Route::get('/',function(){
        $routeCollection = Route::getRoutes();
        foreach ($routeCollection as $route) {
            echo($route->getPath().'</br>');
    }
    });