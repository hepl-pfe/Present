@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">Toutes les classes</h1>
@if(empty($schools->toArray()))
    <div class="informative-box">
        <p class="informative-box__text">Vous n’êtes pas encore <b>membre d'une école</b> ?
            Faites votre <b>demande d'adhésion</b> à une école existante ou créez la vôtre.</p>
        {!! Html::linkAction('Www\SchoolController@getConfig','Aller configuration',[],['class'=>'btn']) !!}
    </div>
@else
    @foreach($schools as $school)
        @if(empty($school->classes->toArray()))
            <div class="informative-box">
                <p class="informative-box__text">Pas encore de <b>Classes</b>? {!! link_to_action('Www\ClassController@create','Créer une classe',[],['class'=>'']) !!}</p>
            </div>
        @else
        <h2 class="epsilon">{!! $school->name !!}</h2>
        <ul class="layout">
            @foreach($school->classes as $class)
                <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
                    <h2 class="box-header">{!! $class->name !!}</h2>
                    <ul class="box">
                        <dl>
                            <dt>Nombre de d'élève :</dt>
                            <dd>{!! 8 !!}</dd>
                        </dl>
                    </ul>
                </li>
            @endforeach
        </ul>
        @endif
    @endforeach
@endif
@stop