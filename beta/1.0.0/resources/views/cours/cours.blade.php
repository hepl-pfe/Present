@extends('layouts.teacher_layout')
@section('title','Cours '. $cour->name)
@section('teacher_content')
    @if(!empty($cour->occurrences->toArray()))
        <ul class="places-box list-block list-block--small">
            @foreach($cour->occurrences as $occurrence)
                <li class="list-block__item--small places__item">Le {!! $occurrence->from->toFormattedDateString() !!}
                    de {!! $occurrence->from_hour->toTimeString() !!}
                    à {!! $occurrence->to_hour->toTimeString() !!} la classe de
                    <i>{!! Html::linkAction('Www\ClassController@show',$occurrence->classe->name,['classe_slug'=>$occurrence->classe->slug]) !!}</i>
                </li>
            @endforeach
        </ul>
    @else
        <div class="layout">
            <div class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
                <ul class="box box--create">
                    <li>
                        <p>Le cours <i>{!! $cour->name !!} </i> n’a pas encore de séance.
                            @unless(empty(Auth::user()->cours->toArray()))
                                <a href="{!! URL::action('Www\PresentController@getPlanificateFull') !!}"
                                   class="" data-form="create-planing-form--cours">
                                    Planifier une séance de cours
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