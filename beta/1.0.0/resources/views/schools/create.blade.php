@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">Configurer l’instition</h1>
{!! Form::open(array('action' => 'Www\SchoolController@store')) !!}
    @include('forms.schools.create')
{!! Form::close() !!}
@stop