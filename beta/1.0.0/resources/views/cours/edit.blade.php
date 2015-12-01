@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">Modifier un cours</h1>
{!! Form::model($cour,['action' => ['Www\CoursController@update',$cour->id],'method'=>'path']) !!}
    @include('forms.cours.edit',['submit'=>'Modifier le cours'])
{!! Form::close() !!}
@stop