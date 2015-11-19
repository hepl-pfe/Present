@extends('layouts.teacher_layout')
@section('teacher_content')
<div>
    <h1 class="big-page-header">Mes élèves</h1>
    {!! link_to_action('Www\StudentController@create','Créer un élève',[],['class'=>'btn btn--soft']) !!}
</div>
@if(true)
    @include('partials.students.students_index')
@else
@endif
@stop