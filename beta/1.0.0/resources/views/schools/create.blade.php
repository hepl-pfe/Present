@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">Créer une école</h1>
{!! Form::open(array('action' => 'Www\SchoolController@store')) !!}
    @include('forms.schools.create',['submit'=>'Créer l’école'])
{!! Form::close() !!}
@stop