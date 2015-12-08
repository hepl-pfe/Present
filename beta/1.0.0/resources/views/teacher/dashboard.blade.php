@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="visuallyhidden">Paneau de controle</h1>
<div class="important-btn-box">
    @unless(empty(Auth::user()->cours->toArray()))
    {!! Html::linkAction('Www\UserController@getPlanificateFull','Planifier une séance de cours ',[],['class'=>'btn','title'=>'Planifier']) !!}
    @endunless
    @if(Auth::user()->hasOccurrence)
        {!! Html::linkAction('Www\PresentController@index','Prendre les présences',[],['class'=>'btn','title'=>'Planifier']) !!}
    @endif
</div>
<div class="layout">
    <div class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        @include('modals.dashbord.classes')
        @include('modals.dashbord.schools')
    </div>
    <div class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        @include('modals.dashbord.cours')
    </div>
    <div class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        @include('modals.dashbord.students')
    </div>
</div>
@stop