@extends('layouts.teacher_layout')
@section('title', 'Éditer un élève')
@section('teacher_content')
    {!! Form::model($student,['action' => ['Www\StudentController@update','id'=>$student->slug],'method'=>'patch']) !!}
        @include('forms.students.edit',['submit'=>'Modifier l’élève'])
    {!! Form::close() !!}
@stop