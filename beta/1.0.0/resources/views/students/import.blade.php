@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1 class="big-page-header">Importer des élèves depuis un fichier</h1>
    {!! Form::open(['action' => 'Www\StudentController@importStudentsList','enctype'=>'multipart/form-data']) !!}
    @include('forms.students.import')
    {!! Form::close() !!}
@stop