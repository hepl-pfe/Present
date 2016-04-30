@extends('layouts.teacher_layout')
@section('title', 'Modifier une classe')
@section('teacher_content')
    <div class="layout">
        <div class="layout">
            <div class="layout__item u-6/12-desk u-12/12-lap u-12/12-palm">
                {!! Form::model($classe,['action' => ['Www\ClassController@update','id'=>$classe->id],'class'=>'layout__item u-12/12-desk u-12/12-lap u-12/12-palm','enctype'=>'multipart/form-data','method'=>'patch']) !!}
                @include('forms.class.edit',['submit'=>'Modifier la classe '.$classe->name])
                {!! Form::close() !!}


            </div>
            <div class="layout__item u-6/12-desk u-12/12-lap u-12/12-palm">
                <div class="layout__item u-6/12-desk u-12/12-lap u-12/12-palm">
                    @include('modals.classes.one-classe')
                </div>
                @foreach($classes as $classe)
                    <div class="layout__item u-6/12-desk u-12/12-lap u-12/12-palm">
                        @include('modals.classes.one-classe')
                    </div>
                @endforeach
                {!! $classes->render() !!}
            </div>
         {{--   {!! Form::open(['action' => ['Www\ClassController@importStudentToClasse','classe_slug'=>$classe->slug],'class'=>'layout__item u-6/12-desk u-12/12-lap u-12/12-palm','enctype'=>'multipart/form-data']) !!}
            @include('forms.class.import_student_to_school',['submit'=>'Ajouter ces élèves à la classe'])
            {!! Form::close() !!}--}}
        </div>
    </div>
@stop