@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">Configuration de l’école</h1>
<ul class="layout">
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2 class="box-header">Format des horaires</h2>
        <ul class="box">
            <li class="box__item">{!! Html::link('#','Format des horaires',['class'=>'btn']) !!}</li>
        </ul>
    </li>
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2 class="box-header">{!! Html::linkAction('Www\ClassController@index','Les classes',[],['class'=>'']) !!}</h2>
        <ul class="box">
            <li class="box__item">{!! link_to_action('Www\ClassController@create','Créer une classe',[],['class'=>'btn']) !!}</li>
            <li class="box__item">{!! link_to_action('Www\ClassController@index','Voir toutes les classes',[],['class'=>'btn']) !!}</li>
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
            <li class="box__item">{!! link_to_action('Www\RoomController@create','Créer un local',[],['class'=>'btn']) !!}</li>
            <li class="box__item">{!! link_to_action('Www\RoomController@index','Voir toutes les locaux',[],['class'=>'btn']) !!}</li>
        </ul>
    </li>
</ul>
@stop