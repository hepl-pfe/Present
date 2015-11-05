@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">Mes cours</h1>
<ul class="layout">
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2>{!! link_to('cours/français','Français',['class'=>'']) !!}</h2>
        <ul class="box">
            <li>08:20 cours avec les 2F</li>
            <li>08:20 cours avec les 2F</li>
            <li>08:20 cours avec les 2F</li>
            <li>08:20 cours avec les 2F</li>
            <li>08:20 cours avec les 2F</li>
        </ul>
    </li>
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2>{!! link_to('cours/français','Théatre',['class'=>'']) !!}</h2>
        <ul class="box">
            <li>08:20 cours avec les 2F</li>
            <li>08:20 cours avec les 2F</li>
            <li>08:20 cours avec les 2F</li>
            <li>08:20 cours avec les 2F</li>
            <li>08:20 cours avec les 2F</li>
        </ul>
    </li>
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2>{!! link_to('cours/français','Expression écrite',['class'=>'']) !!}</h2>
        <ul class="box">
            <li>08:20 cours avec les 2F</li>
            <li>08:20 cours avec les 2F</li>
            <li>08:20 cours avec les 2F</li>
            <li>08:20 cours avec les 2F</li>
            <li>08:20 cours avec les 2F</li>
        </ul>
    </li>
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2>{!! link_to('#','Ajouter un cours',['class'=>'']) !!}</h2>
        <div class="box">
            Ajouter un cours
        </div>
    </li>
</ul>
@stop