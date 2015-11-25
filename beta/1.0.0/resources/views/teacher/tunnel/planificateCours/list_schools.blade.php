@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1 class="big-page-header">Planifier une séance de cours</h1>
    {!! Form::open(['action' => ['Www\UserController@storePlanificateStepOne']]) !!}
        @include('forms.schools.select',['submit'=>'Passer à l’étape 2'])
    {!! Form::close() !!}
@stop