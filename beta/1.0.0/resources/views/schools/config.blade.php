@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">Configuration</h1>
<div class="layout">
    <div class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
        @include('modals.config.time-format')
    </div>
    <div class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">

    </div>
</div>
@stop