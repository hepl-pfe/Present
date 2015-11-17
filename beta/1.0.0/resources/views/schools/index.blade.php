@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">Configuration de l’école</h1>
<ul class="layout">
    @foreach($schools as $school )
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2 class="box-header">{!! $school->name !!}</h2>
        <dl class="box">
            <dt>clef</dt>
            <dd>valeur</dd>
        </dl>
    </li>
    @endforeach
</ul>
@stop