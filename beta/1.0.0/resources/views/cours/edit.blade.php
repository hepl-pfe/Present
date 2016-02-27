@extends('layouts.teacher_layout')
@section('title', 'Modifier un cours')
@section('teacher_content')
{!! Form::model($cour,['action' => ['Www\CoursController@update',$cour->id],'method'=>'patch']) !!}
    @include('forms.cours.edit',['submit'=>'Modifier le cours'])
{!! Form::close() !!}
@stop