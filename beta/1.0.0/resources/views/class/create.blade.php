@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1 class="big-page-header">Créer  une classe</h1>
    {!! Form::open(array('action' => 'Www\ClassController@store')) !!}
     @include('forms.class.create')
    {!! Form::close() !!}
@stop