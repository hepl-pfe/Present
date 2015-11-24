@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1 class="big-page-header">Commencer</h1>
    @if(session('start_step')==1)
    {!! Form::open(array('action' => 'Www\SchoolController@store')) !!}
            @include('forms.schools.create',['submit'=>'continuer'])
    {!! Form::close() !!}
    @elseif(session('start_step')==2)
        {!! Form::open(array('action' => 'Www\CourController@store')) !!}
        @include('forms.cours.create',['submit'=>'continuer'])
        {!! Form::close() !!}
    @endif
@stop