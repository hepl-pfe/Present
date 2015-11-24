@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">Toutes les classes</h1>
    <ul class="layout">
    @foreach($classes as $classe)
            <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
                <h2 class="box-header">{!! $classe->name !!}</h2>
                <ul class="box">
                    <dl>
                        <dt>Nombre de d'élève :</dt>
                        <dd>{!! 8 !!}</dd>
                    </dl>
                </ul>
            </li>
    @endforeach
    </ul>
@stop