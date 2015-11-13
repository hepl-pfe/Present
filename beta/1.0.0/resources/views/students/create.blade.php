@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">Créer un élève</h1>
@include('errors.errors')
{!! Form::open(array('action' => 'Www\StudentController@store')) !!}
    @include('forms.students.create')
{!! Form::close() !!}
@stop