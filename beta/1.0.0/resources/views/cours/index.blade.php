@extends('layouts.teacher_layout')
@section('title', 'Mes cours')
@section('teacher_content')
    <div class="header-action-box">
        <a href="{!! URL::action('Www\CoursController@create') !!}" class="btn btn--blue-svg"
           data-toggle="tooltip" title="Créer un cours">
            <svg class="svg-basic svg--white">
                <use xlink:href="#shape-create"></use>
            </svg>
            <span>Créer un cours</span>
        </a>
        @unless(empty(Auth::user()->cours->toArray()))
            <a href="{!! URL::action('Www\PresentController@getPlanificateFull') !!}" class="btn btn--blue-svg">
                <svg class="svg-basic svg--white">
                    <use xlink:href="#shape-calendar"></use>
                </svg>
                <span>Planifier une séance de cours </span>
            </a>
        @endunless
        @if(Auth::user()->hasOccurrence)
            <a href="{!! URL::action('Www\PresentController@index') !!}" class="btn btn--blue-svg">
                <svg class="svg-basic svg--white">
                    <use xlink:href="#shape-to-do"></use>
                    <span>Prendre les présences</span>
                </svg>
            </a>
        @endif
    </div>
    <ul class="layout box-wrapper">
        @foreach($cours as $cour)
            @if(empty($cours->toArray()))
                <div class="informative-box">
                    <p class="informative-box__text">Pas encore de
                        <b>Classes</b>? {!! link_to_action('Www\ClassController@create','Créer une classe',[],['class'=>'']) !!}
                    </p>
                </div>
            @else
                <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
                    @include('modals.cours.one-cour')
                </li>
            @endif
        @endforeach
    </ul>
    @include('pagination.default', ['paginator' => $cours])
@stop