@extends('layouts.teacher_layout')
@section('teacher_content')
    <div>
        <h1 class="big-page-header">{!! $cour->name !!}</h1>
    </div>
    {!! Form::open(['action'=>'Www\PresentController@storeClassePresent']) !!}
    {!! Form::hidden('occurrence_id',$occurrence->id) !!}
        @foreach($students as $student)
                <div class="profile-container layout__item u-2/12 u-2/12-desk u-3/12-lap u-6/12-palm">
                    <a href="{!! URL::action('Www\StudentController@show',['slug'=>$student->slug]) !!}" title="Renvoie vers la fiche de l’élèves">
                        <img class="profile-picture user-image profile-picture--present"
                             src="{!! asset('./img/default_profile_picture.jpg') !!}" alt="">
                        <span class="profile-name gamma">{!! $student->fullname !!}</span>
                    </a>
                    {!! Form::label('present_'.$student->id,'Présent') !!}
                    {!! Form::radio($student->id,'1',true,['id'=>'present_'.$student->id]) !!}
                    {!! Form::label('absent_'.$student->id,'Absent') !!}
                    {!! Form::radio($student->id,'0',true,['id'=>'absent_'.$student->id]) !!}
                </div>
        @endforeach
    {!! Form::submit('Finir les présences',['class'=>'btn']) !!}
    {!! Form::close() !!}
@stop