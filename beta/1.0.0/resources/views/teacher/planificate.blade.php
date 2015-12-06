@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1 class="big-page-header">Planifier son horraire</h1>
    {!! Form::open(['action' => 'Www\UserController@storePlanificateFull']) !!}
        <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
            {!! Form::label('from','Début de période',['class'=>'floating-placeholder__label']) !!}
            {!! Form::text('from',old('from'),['class'=>'datepicker floating-placeholder__input--huge floating-placeholder__input']) !!}
            @include('errors.error_field',['field'=>'from'])
        </div>
        <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
            {!! Form::label('to','Fin de période',['class'=>'floating-placeholder__label']) !!}
            {!! Form::text('to',old('to'),['class'=>'datepicker floating-placeholder__input--huge floating-placeholder__input']) !!}
            @include('errors.error_field',['field'=>'to'])
        </div>
        <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
            {!! Form::label('day','Sélectionner le jour',['class'=>'floating-placeholder__label']) !!}
            {!! Form::select('day',['0'=>'lundi','1'=>'mardi','2'=>'mercredi','3'=>'jeudi','4'=>'vendredi','5'=>'samedi','6'=>'dimanche'],['class'=>'datepicker floating-placeholder__input--huge floating-placeholder__input']) !!}
            @include('errors.error_field',['field'=>'day'])
        </div>
        <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
            {!! Form::label('from_hour','Début de la séance de cours ( heure ) ',['class'=>'floating-placeholder__label']) !!}
            {!! Form::text('from_hour',old('from_hour'),['class'=>'from floating-placeholder__input--huge floating-placeholder__input']) !!}
            @include('errors.error_field',['field'=>'from_hour'])
        </div>
        <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
            {!! Form::label('to_hour','Fin de la séance de cours ( heure ) ',['class'=>'floating-placeholder__label']) !!}
            {!! Form::text('to_hour',old('to_hour'),['class'=>'from floating-placeholder__input--huge floating-placeholder__input']) !!}
            @include('errors.error_field',['field'=>'to_hour'])
        </div>
        @unless(empty(Auth::user()->schools->toArray()))
            <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
                {!! Form::label('school_id','Choisissez une école',['class'=>'floating-placeholder__label']) !!}
                {!! Form::select('school_id',$schools,null,['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
                @include('errors.error_field',['field'=>'school_id'])
            </div>
        @endunless
        <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
            {!! Form::label('cour_id','Choisissez un cours',['class'=>'floating-placeholder__label']) !!}
            {!! Form::select('cour_id',$cours,null,['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
            @include('errors.error_field',['field'=>'cour_id'])
        </div>
        <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
            {!! Form::label('classe_id','Choisissez une classe',['class'=>'floating-placeholder__label']) !!}
            {!! Form::select('classe_id',$class,old('classe_id'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
            @include('errors.error_field',['field'=>'classe_id'])
        </div>

        <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
            {!! Form::submit('Planifier la séance',['class'=>'btn']) !!}
        </div>
    {!! Form::close() !!}
@stop