@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1 class="big-page-header">Planifier des séances de cours</h1>
    @if(isset($cour))
        <div class="meta-header">Pour le cours de&nbsp;: {!! Html::linkAction('Www\CoursController@show',$cour->name,['slug'=>$cour->slug],['class'=>'link-spacer']) !!}</div>
    @endif
    {!! Form::open(['action' => 'Www\PresentController@storePlanificateFull']) !!}
        @include('forms.seances.create_full_seance',['submit'=>'Planifier ses séances de cours'])
    {!! Form::close() !!}
@stop