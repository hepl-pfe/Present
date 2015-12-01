@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">Mes cours</h1>
<ul class="layout">
    @foreach($cours as $cour)
    @if(empty($cours->toArray()))
        <div class="informative-box">
            <p class="informative-box__text">Pas encore de <b>Classes</b>? {!! link_to_action('Www\ClassController@create','Créer une classe',[],['class'=>'']) !!}</p>
        </div>
    @else
            <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
                <h2 class="box-header">{!! $cour->name !!}</h2>
                <dl class="box">
                    {!!  Form::open(array('action' => array('Www\CoursController@destroy', $cour->id), 'method' => 'delete')) !!}
                    {!! Form::submit('Supprimer le cours',['class'=>'btn btn--alert btn--small']) !!}
                    {!! Form::close() !!}
                </dl>
            </li>
    @endif
@endforeach
</ul>
@stop