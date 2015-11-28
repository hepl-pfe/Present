@extends('layouts.teacher_layout')
@section('teacher_content')
    <div>
        <h1 class="big-page-header">{!! $cour->name !!}</h1>
    </div>
    @foreach($students as $student)
        <li class="profile-container layout__item u-2/12 u-2/12-desk u-3/12-lap u-6/12-palm">
            <a href="{!! URL::to('/eleves/blisntin-stephan') !!}" title="Renvoie vers la fiche de l’élèves">
                <img class="profile-picture user-image profile-picture--present"
                     src="{!! asset('./img/default_profile_picture.jpg') !!}" alt="">
                <span class="profile-name gamma">{!! $student->fullname !!}</span>
            </a>
            {!! Form::open(['action'=>'Www\PresentController@storeOneStudentAbsent']) !!}
                {!! Form::hidden('student_id',$student->id) !!}
                {!! Form::hidden('occurrence_id',$occurrence->id) !!}
                {!! Form::hidden('is_present',0) !!}
                {!! Form::submit('Marquer absent',['class'=>'btn btn--alert']) !!}
            {!! Form::close() !!}
        </li>
    @endforeach
@stop