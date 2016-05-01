@extends('layouts.teacher_layout')
@section('title', 'Créer  une classe')
@section('teacher_content')
    <div class="layout">
        <div class="layout__item u-6/12-desk u-12/12-lap u-12/12-palm">
            {!! Form::open(['action' => 'Www\ClassController@store','enctype'=>'multipart/form-data']) !!}
            @include('forms.class.create',['submit'=>'Créer la classe'])
            {!! Form::close() !!}
        </div>
        <div class="layout__item u-6/12-desk u-12/12-lap u-12/12-palm">
            @foreach($classes as $classe)
                <div class="layout__item u-6/12-desk u-12/12-lap u-12/12-palm">
                    @include('modals.classes.one-classe')
                </div>
            @endforeach
            @include('pagination.default', ['paginator' => $classes])
        </div>
    </div>
@stop