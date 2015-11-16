@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1 class="big-page-header">Collègues</h1>
    @if(count($data)<1)
        <div class="informative-box">
        <div class="informative-box">
            <p class="informative-box__text">Vous n’êtes pas encore <b>membre d'une école</b> ?
                Faites votre <b>demande d'adhésion</b> à une école existante ou créez la vôtre.</p>
            {!! Html::linkAction('Www\SchoolController@getConfig','Aller configuration',[],['class'=>'btn']) !!}
        </div>
    @else
        <ul class="layout">
            @foreach($data as $colleguale)
                <li class="profile-container layout__item u-2/12 u-2/12-desk u-3/12-lap u-6/12-palm">
                    <a href="{!! URL::action('Www\UserController@show',['slug'=>$colleguale->slug]) !!}" title="Renvoie vers la fiche de {!! $colleguale->slug !!} ">
                        <img class="profile-picture user-image" src="./img/default_profile_picture.jpg" alt="">
                        <span class="profile-name">{!! $colleguale->first_name!!}&nbsp;{!! $colleguale->last_name  !!}</span>
                    </a>
                </li>
            @endforeach
        </ul>
    @endif
@stop