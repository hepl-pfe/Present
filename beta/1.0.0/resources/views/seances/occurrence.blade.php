@extends('layouts.teacher_layout')
@section('title', $cour->name)
@section('teacher_content')
    {!! Form::open(['action'=>'Www\PresentController@storeClassePresent']) !!}
    {!! Form::hidden('occurrence_id',$occurrence->id) !!}
    {!! Form::submit('Finir les présences',['class'=>'btn block']) !!}
    <div class="layout">
        @foreach($students as $student)
            <div class="profile-container layout__item u-2/12 u-2/12-desk u-3/12-lap u-6/12-palm is_present">
                <a href="{!! URL::action('Www\StudentController@show',['slug'=>$student->slug]) !!}"
                   title="Renvoie vers la fiche de l’élèves">
                    <img class="profile-picture user-image profile-picture--present"
                         src="{!! asset('./img/default_profile_picture.jpg') !!}" alt="">
                    <span class="profile-name gamma">{!! $student->fullname !!}</span>
                </a>
                <div>
                    {!! Form::label('present_'.$student->id,'Présent') !!}
                    {!! Form::radio($student->id,'1',true,['id'=>'present_'.$student->id]) !!}
                </div>
                <div>
                    {!! Form::label('absent_'.$student->id,'Absent') !!}
                    {!! Form::radio($student->id,'0',false,['id'=>'absent_'.$student->id]) !!}
                </div>
            </div>
        @endforeach
    </div>
    {!! Form::close() !!}
@stop