@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1 class="big-page-header">{!! $student->fullname !!}</h1>
    <div class="media section">
        <img src="{!! asset('img/default_profile_picture.jpg') !!}" alt="" class="media__img user-image user-image--medium">
        <dl class="media-body">
            <dt>Classe :</dt><dd>
            @foreach($student->classes as $class)
                {!! $class->name.' ' !!}
            @endforeach</dd>
        </dl>
    </div>
    <div class="section">
        <div class="gamma">Un joli graphique JSON :) </div>
        <pre>{!! json_encode($student->presences) !!}</pre>
    </div>

    <div class="section">
        {!! Form::open(['action'=>'Www\StudentController@storeNote']) !!}
            {!! Form::hidden('student_id',$student->id) !!}
            @include('forms.students.add_notes')
        {!! Form::close() !!}
    </div>
    @unless(empty($notes->toArray()))
    <div class="layout section">
        <div class="layout__item u-4/12 u-4/12-desk u-6/12-lap u-12/12-palm">
            <h2 class="header_note">Notes</h2>
            <ul class="list-block">
                @foreach($notes as $note)
                <li>{!! $note->note !!}</li>
                @endforeach
            </ul>
        </div>
    </div>
    @endunless
@stop