@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">Mes élèves</h1>
@if(true)
    {!! link_to_action('Www\StudentController@create','Créer un élève',[],['class'=>'btn']) !!}
    {!! link_to_action('Www\StudentController@create','Ajouter un élève',[],['class'=>'btn']) !!}
    @include('partials.students.students_index')
@else
@endif
@stop