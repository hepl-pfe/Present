@extends('layouts.teacher_layout')
@section('title', 'Éditer un élève')
@section('teacher_content')
    <div class="layout">
        <div class="layout__item u-6/12-desk u-12/12-lap u-12/12-palm">
            {!! Form::model($student,['action' => ['Www\StudentController@update','id'=>$student->slug],'method'=>'patch']) !!}
            @include('forms.students.edit',['submit'=>'Modifier l’élève'])
            {!! Form::close() !!}
        </div>
        <div class="layout__item u-6/12-desk u-12/12-lap u-12/12-palm">
            <div class="profile-container layout__item  u-6/12-desk u-12/12-lap u-12/12-palm ">
                @include('modals.students.one-student')
            </div>
            @foreach($students as $student)
                <div class="profile-container layout__item  u-6/12-desk u-12/12-lap u-12/12-palm ">
                    @include('modals.students.one-student')
                </div>
            @endforeach
            {!! $students->render() !!}
        </div>
    </div>
@stop