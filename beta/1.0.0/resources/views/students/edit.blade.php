@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1 class="big-page-header">Modifier un élève</h1>
    {!! Form::model($student,['action' => ['Www\StudentController@update','id'=>$student->slug],'method'=>'patch']) !!}
        @include('forms.students.edit',['submit'=>'Modifier l’élève'])
    {!! Form::close() !!}
@stop