@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">Mes présences</h1>
<ul class="layout">
    @foreach($occurrences as $occurrence)
    @if(false)
        <div class="informative-box">
            <p class="informative-box__text">Pas encore de <b>Classes</b>? {!! link_to_action('Www\ClassController@create','Créer une classe',[],['class'=>'']) !!}</p>
        </div>
    @else
            <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
                <h2 class="box-header">{!! $occurrence->id !!}</h2>
                <dl class="box">
                    {!! link_to_action('Www\PresentController@getAllStudentfromOneOccurrence','Prendre ce cours',['id'=>$occurrence->id],['class'=>'btn']) !!}
                </dl>
            </li>
    @endif
@endforeach
</ul>
@stop