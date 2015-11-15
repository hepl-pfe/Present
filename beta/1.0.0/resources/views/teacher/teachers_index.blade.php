@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">Collègue</h1>
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
@stop