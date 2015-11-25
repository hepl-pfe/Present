@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">Créer un cours</h1>
{!! Form::open(array('action' => 'Www\CoursController@store')) !!}
    @include('forms.cours.create',['submit'=>'Créer un cours'])
{!! Form::close() !!}
@stop