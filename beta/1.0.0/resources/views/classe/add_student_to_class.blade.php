@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1 class="big-page-header">Ajouter des élèves à la classe <i>{!! $classe->name !!}</i></h1>
    @if(empty(Auth::user()->students->toArray()))
        {!! Form::open(['action' => ['Www\ClassController@importStudentToClasse','classe_slug'=>$classe->slug],'class'=>'layout__item u-6/12-desk u-12/12-lap u-12/12-palm','enctype'=>'multipart/form-data']) !!}
        @include('forms.class.import_student_to_school',['submit'=>'Ajouter ces élèves à la classe'])
        {!! Form::close() !!}
    @else
        {!! Form::open(['action' => ['Www\ClassController@addStudentToClasse','classe_slug'=>$classe->slug],'class'=>'layout__item u-6/12-desk u-12/12-lap u-12/12-palm','enctype'=>'multipart/form-data']) !!}
        @include('forms.class.add_student_to_school',['submit'=>'Modifier ces élèves à la classe'])
        {!! Form::close() !!}
    @endif
@stop