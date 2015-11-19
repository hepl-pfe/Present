@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">Configuration de l’école</h1>
<ul class="layout">
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2 class="box-header">Format des horaires</h2>
        <ul class="box">
            <li class="box__item">{!! Html::link('#','Format des horaires',['classs'=>'btn']) !!}</li>
        </ul>
    </li>
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2 class="box-header">{!! Html::linkAction('Www\ClassController@index','Mes classes',[],['class'=>'']) !!}</h2>
        <ul class="box">
            <li class="box__item">{!! link_to_action('Www\ClassController@create','Créer une classe',[],['class'=>'btn']) !!}</li>
            <li class="box__item">{!! link_to_action('Www\ClassController@index','Voir toutes les classes',[],['class'=>'btn']) !!}</li>
        </ul>
    </li>
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2 class="box-header">Se lier à une école</h2>
        <ul class="box">
           <li class="box__item">
               {!! link_to_action('Www\SchoolController@create','Créer une école',[],['class'=>'btn']) !!}
           </li>
            @foreach($all_schools as $school)
                <li>{!! link_to_action('Www\UserController@addUserToSchool','Demande d’adhésion à : '.$school->name,['id'=>$school->id],['class'=>'']) !!}</li>
            @endforeach
        </ul>
    </li>
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2 class="box-header">Créer des élèves</h2>
        <ul class="box">
            <li class="box__item">{!! link_to_action('Www\StudentController@create','Créer un élève',[],['class'=>'btn']) !!}</li>
        </ul>
    </li>
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2 class="box-header">Créer des locaux</h2>
        <ul class="box">
            {!! link_to_action('Www\RoomController@create','Créer des locaux',[],['class'=>'btn']) !!}
        </ul>
    </li>
</ul>
@stop