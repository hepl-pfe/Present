@extends('layouts.teacher_layout')
@section('title', 'Enregistrer un élève')
@section('teacher_content')
    {!! Form::open(['action' => 'Www\StudentController@store']) !!}
        @include('forms.students.create',['submit'=>'Créer l’élève'])
    {!! Form::close() !!}
@stop