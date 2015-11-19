@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1 class="big-page-header">Collègues</h1>
    {!! Form::open([''=>'/']) !!}
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
        {!! Form::label('school_id','Uniquement',['class'=>'floating-placeholder__label']) !!}
        {!! Form::select('school_id',$schools->lists('name','id'),old('school_id'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
        @include('errors.error_field',['field'=>'school_id'])
    </div>
    {!! Form::close() !!}
    @if(is_null($schools))
        <div class="informative-box">
            <p class="informative-box__text">Vous n’êtes pas encore <b>membre d'une école</b> ?
                Faites votre <b>demande d'adhésion</b> à une école existante ou créez la vôtre.</p>
            {!! Html::linkAction('Www\SchoolController@getConfig','Aller configuration',[],['class'=>'btn']) !!}
        </div>
    @else
        @if(count($schools)<1)
            <div class="informative-box">
                <p class="informative-box__text">Pas encore de <b>collègues</b>?  Demandez à vos collègues de venir <b>s'inscrire.</b></p>
            </div>
        @else
            <div class="cla">
                <ul class="layout">
                    @foreach($schools as $school)
                            @foreach($school->users as $user)
                            <li class="layout__item u-2/12-desk u-6/12-lap u-12/12-palm">
                                <a href="{!! URL::action('Www\UserController@show',['school_slug'=>$school->slug,'user_slug'=>$user->slug]) !!}" title="Renvoie vers la fiche de " class="media colleague__item">
                                    <img class="user-image user-image--small media__img" src="./img/default_profile_picture.jpg" alt="">
                                    <span class="media-body colleague__item__name">{!! $user->first_name !!}&nbsp;{!! $user->last_name !!}</span>
                                </a>
                            </li>
                            @endforeach
                    @endforeach
                </ul>
            </div>
        @endif
    @endif
@stop