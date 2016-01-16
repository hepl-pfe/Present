@extends('layouts.teacher_layout')
@section('teacher_content')
<div>
    <h1 class="big-page-header">Mes écoles</h1>
    <a href="{!! URL::action('Www\SchoolController@create') !!}" class="btn btn--blue-svg">
        <svg class="svg-basic svg--white">
            <use xlink:href="#shape-create"></use>
            <span>Créer une école</span>
        </svg>
    </a>
</div>
<ul class="layout">
    @foreach($schools as $school )
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2 class="box-header">{!! $school->name !!}</h2>
        <div class="box">
            <dl class="">
                <dt>clef</dt>
                <dd>valeur</dd>
            </dl>
            {!!  Form::open(array('action' => array('Www\SchoolController@destroy', $school->id), 'method' => 'delete')) !!}
            {!! Form::submit('Supprimer cette école',['class'=>'btn btn--alert btn--small']) !!}
            {!! Form::close() !!}
        </div>
    </li>
    @endforeach
</ul>
@stop