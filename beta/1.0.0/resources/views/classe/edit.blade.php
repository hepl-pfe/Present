@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1 class="big-page-header">Modifier une classe</h1>
    <div class="layout">
        {!! Form::model($classe,['action' => ['Www\ClassController@update','id'=>$classe->id],'class'=>'layout__item u-6/12-desk u-12/12-lap u-12/12-palm','enctype'=>'multipart/form-data','method'=>'patch']) !!}
                @include('forms.class.edit',['submit'=>'Modifier la classe'])
        {!! Form::close() !!}

        {!! Form::model($classe,['action' => ['Www\ClassController@update','id'=>$classe->id],'class'=>'layout__item u-6/12-desk u-12/12-lap u-12/12-palm','enctype'=>'multipart/form-data','method'=>'patch']) !!}
                @include('forms.class.add_student_to_school',['submit'=>'Ajouter ces élèves à la classe'])
        {!! Form::close() !!}
    </div>
@stop