@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">Configuration</h1>
<ul class="layout">
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2 class="box-header">Plage horaire</h2>
        <ul class="box">
            <li class="box__item">{!! Html::link('#','Format des horaires',['class'=>'btn btn--small']) !!}</li>
        </ul>
    </li>
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2 class="box-header">Créer des locaux</h2>
        <ul class="box">
            <li class="box__item">{!! link_to_action('Www\RoomController@create','Créer un local',[],['class'=>'btn btn--small']) !!}</li>
            <li class="box__item">{!! link_to_action('Www\RoomController@index','Voir toutes les locaux',[],['class'=>'btn btn--small']) !!}</li>
        </ul>
    </li>
</ul>
@stop