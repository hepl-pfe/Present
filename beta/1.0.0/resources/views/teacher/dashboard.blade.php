@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="visuallyhidden">Paneau de controleskjksjksjksj</h1>
<ul class="layout">
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
            <h2 class="box-header"> Mes cours d‘aujourd'hui</h2>
            <ul class="box">
                <li>08:20 cours avec les {!! Html::link('/cours/français','2F') !!}</li>
                <li>08:20 cours avec les {!! Html::link('/cours/français','2F') !!}</li>
                <li>08:20 cours avec les {!! Html::link('/cours/français','2F') !!}</li>
                <li>08:20 cours avec les {!! Html::link('/cours/français','2F') !!}</li>
                <li>08:20 cours avec les {!! Html::link('/cours/français','2F') !!}</li>
            </ul>
    </li>
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
            <h2 class="box-header">Mes élèves</h2>
            <ul class="box">
                <li>{!! Html::link('/eleves/blisntin-stephan','Armound Adeline') !!}</li>
                <li>{!! Html::link('/eleves/blisntin-stephan','Blisntin Stéphan') !!}</li>
                <li>{!! Html::link('/eleves/blisntin-stephan','Crutzen Marie') !!}</li>
                <li>{!! Html::link('/eleves/blisntin-stephan','Delayen Estelle') !!}</li>
                <li>{!! Html::link('/eleves/blisntin-stephan','Gérard Sylvain') !!}</li>
            </ul>
    </li>
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
            <h2 class="box-header">Mes collègues</h2>
            <ul class="box">
                <li>{!! Html::link('/teachers/blisntin-stephan','Armound Adeline') !!}</li>
                <li>{!! Html::link('/teachers/blisntin-stephan','Blisntin Stéphan') !!}</li>
                <li>{!! Html::link('/teachers/blisntin-stephan','Crutzen Marie') !!}</li>
                <li>{!! Html::link('/teachers/blisntin-stephan','Delayen Estelle') !!}</li>
                <li>{!! Html::link('/teachers/blisntin-stephan','Gérard Sylvain') !!}</li>
            </ul>
    </li>
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
            <h2 class="box-header">Mes groupes</h2>
            <ul class="box">
                <li>{!! Html::link('/eleves/blisntin-stephan','Armound Adeline') !!}</li>
                <li>{!! Html::link('/eleves/blisntin-stephan','Blisntin Stéphan') !!}</li>
                <li>{!! Html::link('/eleves/blisntin-stephan','Crutzen Marie') !!}</li>
                <li>{!! Html::link('/eleves/blisntin-stephan','Delayen Estelle') !!}</li>
                <li>{!! Html::link('/eleves/blisntin-stephan','Gérard Sylvain') !!}</li>
            </ul>
    </li>
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2 class="box-header">Mon compte</h2>
        <div class="box">
            <p>Didier Lionel</p>
            <p>15 heures de cours</p>
            <p>200 élèves</p>
        </div>
    </li>
</ul>
@stop