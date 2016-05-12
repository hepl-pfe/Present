@extends('layouts.teacher_layout')
@section('title', 'Valider votre liste d’élève')
@section('teacher_content')
    {!! Form::open(['action' => 'Www\StudentController@storeValidatedInport','method'=>'post','class'=>'']) !!}
    <div class="header-action-box">
        @include('partials.nav.import_nav')
        {!! Form::submit('Importer ces élèves',['class'=>'btn']) !!}
    </div>
    <div class="student-list layout">
        <?php $i = 1; ?>
        @foreach($studentImport as $student)
            <div class="layout__item u-4/12 ">
                <div class="student-item student-item-succes box">
                    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
                        <label for="first_name-<?php echo($i); ?>" class="floating-placeholder__label">Le prénom de
                            l’élève @include('forms.partials.required')</label>
                        {!! Form::input('text','first_name-'.$i,null==old('first_name-'.$i)?$student['first_name']:old('first_name-'.$i),['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : Claude','id'=>'first_name-'.$i]) !!}
                        @include('errors.error_field',['field'=>'first_name-'.$i])
                    </div>
                    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
                        <label for="last_name-<?php echo($i); ?>" class="floating-placeholder__label">Le nom
                            l’élève @include('forms.partials.required')</label>
                        {!! Form::input('text','last_name-'.$i,null==old('last_name-'.$i)?$student['last_name']:old('last_name-'.$i),['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : Claude','id'=>'last_name-'.$i]) !!}
                        @include('errors.error_field',['field'=>'last_name-'.$i])
                    </div>
                    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
                        <label for="email-<?php echo($i); ?>" class="floating-placeholder__label">L’e-mail de
                            l’élève @include('forms.partials.required')</label>
                        {!! Form::input('text','email-'.$i,null==old('email-'.$i)?$student['email']:old('email-'.$i),['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : Claude','id'=>'email-'.$i]) !!}
                        @include('errors.error_field',['field'=>'email-'.$i])
                    </div>
                </div>
            </div>
            <?php $i++; ?>
        @endforeach
    </div>
    {!! Form::hidden('nbr',$i) !!}
    {!! Form::submit('Importer ces élèves',['class'=>'btn']) !!}
    {!! Form::close() !!}
@stop