@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">Mes cours</h1>
@if(empty($cours->toArray()))
    <div class="informative-box">
        <p class="informative-box__text">Vous n’êtes pas encore <b>membre d'une école</b> ?
            Faites votre <b>demande d'adhésion</b> à une école existante ou créez la vôtre.</p>
        {!! Html::linkAction('Www\SchoolController@getConfig','Aller configuration',[],['class'=>'btn']) !!}
    </div>
@else
    <ul class="layout">
    @foreach($cours as $cour)
        @if(empty($cour->toArray()))
            <div class="informative-box">
                <p class="informative-box__text">Pas encore de <b>Classes</b>? {!! link_to_action('Www\ClassController@create','Créer une classe',[],['class'=>'']) !!}</p>
            </div>
        @else
                <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
                    <h2 class="box-header">{!! $cour->name !!}</h2>
                    <dl class="box">
                        <dt>classes:</dt>
                        <dd>24,5G</dd>
                    </dl>
                </li>
        @endif
    @endforeach
    </ul>
@endif
@stop