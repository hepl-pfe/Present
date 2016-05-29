@extends('layouts.teacher_layout')
@section('title', 'Accueil')
@section('teacher_content')
    @include('partials.panel.index_actions')
    <div class="layout">
        <div class="box-container layout__item u-4/12-desk u-12/12-lap u-12/12-palm">
            @include('modals.dashbord.classes')
            @include('modals.dashbord.cours')
        </div>
        <div class="box-container layout__item u-4/12-desk u-12/12-lap u-12/12-palm">
            @include('modals.dashbord.planning')
        </div>
        <div class="box-container layout__item u-4/12-desk u-12/12-lap u-12/12-palm">
            @include('modals.dashbord.students')
        </div>
    </div>
@stop