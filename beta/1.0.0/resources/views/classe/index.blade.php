@extends('layouts.teacher_layout')
@section('title', 'Mes classes')
@section('teacher_content')
    @include('partials.panel.index_actions')
    <ul class="layout">
        @foreach($classes as $classe)
            <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
               @include('modals.classes.one-classe')
            </li>
        @endforeach
    </ul>
    @include('pagination.default', ['paginator' => $classes])
@stop