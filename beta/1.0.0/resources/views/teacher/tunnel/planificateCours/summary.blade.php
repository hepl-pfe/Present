@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1 class="big-page-header">Récapitulons</h1>
    {!! Form::open(['action' => 'Www\UserController@storePlanification']) !!}
            {!! Form::label('from','De quand ',['class'=>'']) !!}
            {!! Form::date('from',old('from'),['id'=>'from']) !!}
            {!! Form::label('to','à ',['class'=>'']) !!}
            {!! Form::date('to',old('to'),['id'=>'to']) !!}
            {!! Form::submit('Planifier la séance',['class'=>'']) !!}
    {!! Form::close() !!}
@stop