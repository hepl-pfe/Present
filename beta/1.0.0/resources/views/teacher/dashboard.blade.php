@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1 class="visuallyhidden">Paneau de controle</h1>
    <div class="important-btn-box">
        @unless(empty(Auth::user()->cours->toArray()))
            <a href="{!! URL::action('Www\UserController@getPlanificateFull') !!}" class="btn btn--blue-svg">
                <svg class="svg-basic svg--white">
                    <use xlink:href="#shape-calendar"></use>
                </svg>
                <span>Planifier une séance de cours</span>
            </a>
        @endunless
        @if(Auth::user()->hasOccurrence)
            <a href="{!! URL::action('Www\PresentController@index') !!}" class="btn btn--blue-svg">
                <svg class="svg-basic svg--white">
                    <use xlink:href="#shape-to-do"></use>
                </svg>
                <span>Prendre les présences</span>
            </a>
        @endif
    </div>
    <div class="layout">
        <div class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
            @include('modals.dashbord.classes')
        </div>
        <div class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
            @include('modals.dashbord.cours')
        </div>
        <div class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
            @include('modals.dashbord.students')
        </div>
    </div>
@stop