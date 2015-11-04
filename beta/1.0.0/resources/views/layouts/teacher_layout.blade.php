@extends('layouts.master_layout')
@section('content')
<div role="header" class="layout main-header">
    @include('partials.panel.teacher_controller')
</div>
<main class="layout">
@include('partials.nav.teacher_nav')
<div class="layout__item u-10/12-desk u-10/12-lap u-12/12-palm main-content">
    @yield('teacher_content')
</div>
</main>
@stop