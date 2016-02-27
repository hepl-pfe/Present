@extends('layouts.teacher_layout')
@section('title', 'Créer son horaire')
@section('teacher_content')
{!! Form::open(array('action' => 'Www\UserController@storeBindEvent')) !!}
        @include('forms.teachers.bindEvent')
{!! Form::close() !!}
@stop