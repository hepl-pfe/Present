@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1 class="big-page-header">La classe : <i>{!! $classe->name !!}</i></h1>
    @if(!empty($classe->occurrences->toArray()))
        <ul class="places-box list-block list-block--small">
            @foreach($classe->occurrences as $occurrence)
                <li class="list-block__item--small places__item">{!! $occurrence->from->toFormattedDateString() !!}
                    de {!! $occurrence->from_hour->toTimeString() !!}
                    à {!! $occurrence->to_hour->toTimeString() !!} le cours de
                    <i>{!! Html::linkAction('Www\CoursController@show',$occurrence->cour->name,['cour_slug'=>$occurrence->cour->slug]) !!}</i>
                </li>
            @endforeach
            <li> Vous pouvez &nbsp;:
                {!! Html::linkAction('Www\ClassController@create','Créer une classe') !!}
                {!! Html::linkAction('Www\CoursController@create','Créer un cours') !!}
                {!! Html::linkAction('Www\PresentController@getPlanificateFull','Planifier une séance cours') !!}
            </li>
        </ul>
    @else
        <div class="layout">
            <div class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
                <ul class="box box--create">
                    <li>
                        <p>La classe <i>{!! $classe->name !!} </i> n’a pas encore de séance.
                            <a href="{!! URL::action('Www\CoursController@create') !!}"
                               class="" data-form="create-cours-form"> Créer un cours
                            </a>
                            @unless(empty(Auth::user()->cours->toArray()))
                                <a href="{!! URL::action('Www\PresentController@getPlanificateFull') !!}"
                                   class="" data-form="create-planing-form--cours">
                                    ou Planifier une séance de cours
                                </a>
                            @endunless
                        </p>
                        <div class="form-hidde create-cours-form">
                            {!! Form::open(['action' => 'Www\CoursController@store','enctype'=>'multipart/form-data','class'=>'']) !!}
                            <a href="#" data-form="create-cours-form" class="hide-modal--top">
                                <svg class="hide-modal--top__svg svg--alert">
                                    <use xlink:href="#shape-close-modal"></use>
                                </svg>
                                <span class="visuallyhidden">fermer la fenêtre</span>
                            </a>
                            @include('forms.cours.create',['submit'=>'Créer le cours'])
                            <a href="#" data-form="create-cours-form">fermer la fenêtre</a>
                            {!! Form::close() !!}
                        </div>
                        <div class="form-hidde create-planing-form--cours">
                            {!! Form::open(['action' => 'Www\PresentController@storePlanificateFull']) !!}
                            <a href="#" data-form="create-planing-form--cours" class="hide-modal--top">
                                <svg class="hide-modal--top__svg svg--alert">
                                    <use xlink:href="#shape-close-modal"></use>
                                </svg>
                                <span class="visuallyhidden">fermer la fenêtre</span>
                            </a>
                            @include('forms.seances.create_full_seance',['submit'=>'Planifier des séances de cours'])
                            <a href="#" data-form="create-planing-form--cours">fermer la fenêtre</a>
                            {!! Form::close() !!}
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    @endif
@stop