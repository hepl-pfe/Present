@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">Configuration de l’école</h1>
<ul class="layout">
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2 class="box-header">Format des horaires</h2>
        <ul class="box">
            {!! Html::link('#','Format des horaires',['classs'=>'btn']) !!}
        </ul>
    </li>
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2 class="box-header">Créer des classes</h2>
        <ul class="box">
            {!! link_to_action('Www\SchoolController@create','Créer des classes',[],['class'=>'btn']) !!}
        </ul>
    </li>
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2 class="box-header">Se lier à une école</h2>
        <ul class="box">
           <li>
               {!! link_to_action('Www\SchoolController@create','Créer une école',[],['class'=>'btn']) !!}
           </li>
            @unless(count($schools)==0)
                @foreach($schools as $school)
                    @unless($school->id < 1)
                    <li>{!! link_to_action('Www\SchoolController@addUserToSchool','S’ajouté à l’école : '.$school->name,['id'=>$school->id],['class'=>'']) !!}</li>
                    @endunless
                @endforeach
            @endunless
        </ul>
    </li>
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2 class="box-header">Créer des élèves</h2>
        <ul class="box">
            {!! link_to_action('Www\StudentController@create','Créer un élève',[],['class'=>'btn']) !!}
        </ul>
    </li>
</ul>
@stop