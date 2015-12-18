@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1 class="big-page-header">Créer  une classe</h1>
    {!! Form::open(['action' => 'Www\ClassController@store','enctype'=>'multipart/form-data']) !!}
        @include('forms.class.create',['submit'=>'Créer la classe'])
    {!! Form::close() !!}
@stop