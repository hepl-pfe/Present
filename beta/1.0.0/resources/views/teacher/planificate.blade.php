@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1 class="big-page-header">Planifier son horraire</h1>
    {!! Form::open(['action' => 'Www\UserController@storePlanificateFull']) !!}
        <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
            {!! Form::label('classe_id','Choisissez une classe',['class'=>'floating-placeholder__label']) !!}
            {!! Form::select('classe_id',$class,old('classe_id'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
            @include('errors.error_field',['field'=>'classe_id'])
        </div>
        <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
            {!! Form::label('classe_id','Choisissez une classe',['class'=>'floating-placeholder__label']) !!}
            {!! Form::select('classe_id',$class,old('classe_id'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
            @include('errors.error_field',['field'=>'classe_id'])
        </div>
        <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
            {!! Form::label('cour_id','Choisissez un cours',['class'=>'floating-placeholder__label']) !!}
            {!! Form::select('cour_id',$cours,null,['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
            @include('errors.error_field',['field'=>'cour_id'])
        </div>
        <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
            {!! Form::label('school_id','Choisissez une école',['class'=>'floating-placeholder__label']) !!}
            {!! Form::select('school_id',$schools,null,['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
            @include('errors.error_field',['field'=>'school_id'])
        </div>
        <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
            {!! Form::label('day','le jour ',['class'=>'floating-placeholder__label']) !!}
            {!! Form::text('day',old('day'),['id'=>'datepicker','class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
            @include('errors.error_field',['field'=>'day'])
        </div>
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
            {!! Form::label('from','De quand ',['class'=>'floating-placeholder__label']) !!}
            {!! Form::text('from',old('from'),['id'=>'from','class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
            @include('errors.error_field',['field'=>'from'])
        </div>
        <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
            {!! Form::label('to','à ',['class'=>'floating-placeholder__label']) !!}
            {!! Form::text('to',old('to'),['id'=>'to','class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
            @include('errors.error_field',['field'=>'to'])
        </div>
        <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
            {!! Form::submit('Planifier la séance',['class'=>'btn']) !!}
        </div>
    {!! Form::close() !!}
@stop