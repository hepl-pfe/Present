@extends('layouts.teacher_layout')
@section('title', 'Modifier un cours')
@section('teacher_content')
    <div class="layout">
        <div class="layout__item u-6/12-desk u-12/12-lap u-12/12-palm">
            {!! Form::model($cour,['action' => ['Www\CoursController@update',$cour->id],'method'=>'patch']) !!}
            @include('forms.cours.edit',['submit'=>'Modifier le cours'])
            {!! Form::close() !!}
        </div>
        <div class="layout__item u-6/12-desk u-12/12-lap u-12/12-palm">
            @foreach($cours as $cour)
                <div class="layout__item u-6/12-desk u-12/12-lap u-12/12-palm">
                    @include('modals.cours.one-cour')
                </div>
            @endforeach
            {!! $cours->render() !!}
        </div>
@stop