@extends('layouts.teacher_layout')
@section('title', 'Créer un élève')
@section('teacher_content')
    <div class="layout">
        <div class="layout__item u-6/12-desk u-12/12-lap u-12/12-palm">
            {!! Form::open(['action' => 'Www\StudentController@store']) !!}
            @include('forms.students.create',['submit'=>'Créer l’élève'])
            {!! Form::close() !!}
        </div>
        <div class="layout__item u-6/12-desk u-12/12-lap u-12/12-palm">
            @foreach($students as $student)
                <div class="profile-container layout__item  u-6/12-desk u-12/12-lap u-12/12-palm ">
                    @include('modals.students.one-student')
                </div>
            @endforeach
            {!! $students->render() !!}
        </div>
    </div>
@stop