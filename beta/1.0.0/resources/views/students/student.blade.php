@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1 class="big-page-header">{!! $student->fullname !!}</h1>
    <div class="media section">
        <img src="{!! asset('img/default_profile_picture.jpg') !!}" alt=""
             class="media__img user-image user-image--medium">
        <dl class="media-body">
            <dt>Appartient à la classe :</dt>
            <dd>
                @foreach($student->classes as $class)
                    {!! Html::linkAction('Www\ClassController@show',$class->name,['classe_slug'=>$class->slug]) !!}
                @endforeach</dd>
            <dt>Ses cours :</dt>
            <dd>
                @foreach($student->classes as $classe)
                    @foreach($classe->cours as $cour)
                        {!! Html::linkAction('Www\CoursController@show',$cour->name,['cour_slug'=>$cour->slug]) !!}
                    @endforeach
                @endforeach</dd>
        </dl>
    </div>
    {!! Form::close() !!}
    <div class="">
        <div id="calendar_basic"></div>
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
    {!!  Form::open(['action' => ['Www\StudentController@destroy'], 'method' => 'delete','class'=>'']) !!}
    {!! Form::hidden('student_id',$student->id) !!}
    <button class="btn btn--alert btn--red-svg"
            data-toggle="tooltip" title="Supprimer l’élève : : {!! $student->fullname !!}">
        <svg class="svg-basic svg--white">
            <use xlink:href="#shape-trash"></use>
        </svg>
        <span class="">Supprimer l’élève : {!! $student->fullname !!}</span>
    </button>
@stop