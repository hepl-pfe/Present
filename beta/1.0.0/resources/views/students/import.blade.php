@extends('layouts.teacher_layout')
@section('title', 'Importer une liste d’élève')
@section('teacher_content')
    <div class="layout">
        <div class="box-container layout__item u-6/12-desk u-12/12-lap u-12/12-palm">
            {!!  Html::linkAction('Www\FileController@getCSVExemple','Télécharger un fichier d’exemple') !!}
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