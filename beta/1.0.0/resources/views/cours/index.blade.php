@extends('layouts.teacher_layout')
@section('title', 'Mes cours')
@section('teacher_content')
    @include('partials.panel.index_actions')
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