@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">Toutes les classes</h1>
    <ul class="layout">
    @foreach($classes as $classe)
            <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
                <h2 class="box-header">{!! $classe->name !!}</h2>
                <ul class="box">
                    <ul>
                        @foreach($classe->students as $student)
                        <li>
                            {!! link_to_action('Www\StudentController@show',$student->fullname,['slug'=>$student->slug],[]) !!}
                        </li>
                        @endforeach
                    </ul>
                    {!!  Form::open(array('action' => array('Www\ClassController@destroy', $classe->id), 'method' => 'delete')) !!}
                        {!! Form::submit('Supprimer la classe',['class'=>'btn btn--alert btn--small']) !!}
                    {!! Form::close() !!}
                </ul>
            </li>
    @endforeach
    </ul>
@stop