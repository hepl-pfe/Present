@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">Ajouter un élève</h1>
{!! Form::open(['url'=>'/']) !!}
    @include('forms.students.create')
{!! Form::close() !!}
@stop