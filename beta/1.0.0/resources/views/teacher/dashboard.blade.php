@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="visuallyhidden">Paneau de controle</h1>
<ul class="layout">
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        @include('modals.dashbord.cours')
    </li>
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        @include('modals.dashbord.classes')
    </li>
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        @include('modals.dashbord.students')
    </li>
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        @include('modals.dashbord.take-present')
    </li>
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        @include('modals.dashbord.colleagues')
    </li>
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        @include('modals.dashbord.compte')
    </li>
</ul>
@stop