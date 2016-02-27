@extends('layouts.teacher_layout')
@section('title', 'Enregistrer  une classe')
@section('teacher_content')
    {!! Form::open(['action' => 'Www\ClassController@store','enctype'=>'multipart/form-data']) !!}
        @include('forms.class.create',['submit'=>'Créer la classe'])
    {!! Form::close() !!}
@stop