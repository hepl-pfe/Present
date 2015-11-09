@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">Mes élèves</h1>
<a href="#" class="btn">Ajouter un élève</a>
@include('partials.students.students_index')
@stop