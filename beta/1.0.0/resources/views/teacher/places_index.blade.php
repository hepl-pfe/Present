@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">Les locaux</h1>
<ul class="layout">
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2>{!! link_to('places/b12','B 12') !!}</h2>
        <ul class="box">
            <li>08:20 cours avec les 2F</li>
            <li>09:20 cours avec les 3G</li>
            <li>08:20 cours avec les 6G</li>
            <li>08:20 cours avec les 2J</li>
        </ul>
    </li>
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2>{!! link_to('places/b12','B 13') !!}</h2>
        <ul class="box">
            <li>08:20 cours avec les 2F</li>
            <li>09:20 cours avec les 3G</li>
            <li>08:20 cours avec les 6G</li>
            <li>08:20 cours avec les 2J</li>
        </ul>
    </li>
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2>{!! link_to('places/b12','B 14') !!}</h2>
        <ul class="box">
            <li>08:20 cours avec les 2F</li>
            <li>09:20 cours avec les 3G</li>
            <li>08:20 cours avec les 6G</li>
            <li>08:20 cours avec les 2J</li>
        </ul>
    </li>
    <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        <h2>{!! link_to('places/b12','B 15') !!}</h2>
        <ul class="box">
            <li>08:20 cours avec les 2F</li>
            <li>09:20 cours avec les 3G</li>
            <li>08:20 cours avec les 6G</li>
            <li>08:20 cours avec les 2J</li>
        </ul>
    </li>
</ul>
@stop