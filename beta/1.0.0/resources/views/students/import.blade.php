@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1 class="big-page-header">Importer des élèves</h1>
    <div class="layout">

        <div class="box-container layout__item u-6/12-desk u-12/12-lap u-12/12-palm">
            {!! Form::open(['action' => 'Www\StudentController@importStudentsList','enctype'=>'multipart/form-data']) !!}
            @include('forms.students.import')
            {!! Form::close() !!}
        </div>
        <div class="box-container layout__item u-6/12-desk u-12/12-lap u-12/12-palm">
            <ul class="student-list layout" id="student-import-list">
            </ul>
        </div>
    </div>
@stop