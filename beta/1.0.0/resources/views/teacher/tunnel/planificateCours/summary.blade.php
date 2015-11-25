@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1 class="big-page-header">Récapitulons</h1>
    {!! json_encode($session) !!}
    {!! Form::open(['action' => 'Www\UserController@storePlanificateStepThree']) !!}
            {!! Form::date('from',old('from'),['class'=>'datepicker']) !!}
    {!! Form::close() !!}
@stop