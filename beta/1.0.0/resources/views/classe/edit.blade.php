@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1 class="big-page-header">Modifier une classe</h1>
    {!! Form::model($classe,['action' => ['Www\ClassController@update','id'=>$classe->id],'enctype'=>'multipart/form-data','method'=>'patch']) !!}
        @include('forms.class.edit',['submit'=>'Modifier la classe'])
    {!! Form::close() !!}
@stop