@extends('layouts.teacher_layout')
@section('title', 'Enregistrer un cours')
@section('teacher_content')
<div class="layout">
    <div class="layout__item u-6/12-desk u-12/12-lap u-12/12-palm">
        {!! Form::open(['action' => 'Www\CoursController@store']) !!}
            @include('forms.cours.create',['submit'=>'Créer un cours'])
        {!! Form::close() !!}
    </div>
    <div class="layout__item u-6/12-desk u-12/12-lap u-12/12-palm">
        <ul class="list-student"></ul>
    </div>
</div>
@stop