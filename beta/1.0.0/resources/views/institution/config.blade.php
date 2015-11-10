@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">Configuration de l’institution</h1>
<ul class="layout">
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2 class="box-header">Format des horaires</h2>
        <ul class="box">
            {!! Html::link('#','Format des horaires',['classs'=>'btn']) !!}
        </ul>
    </li>
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2 class="box-header">Identiter de l’école</h2>
        <ul class="box">
            {!! Html::link('#','Ajouter des informations',['classs'=>'btn']) !!}
        </ul>
    </li>

</ul>
@stop