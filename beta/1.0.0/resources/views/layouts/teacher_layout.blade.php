@extends('layouts.master_layout')
@section('content')
<div role="header" class="layout">
    @include('partials.panel.teacher_controller')
</div>
<main class="layout">
@include('partials.nav.teacher_nav')
<div class="layout__item u-10/12">
    @yield('teacher_content')
</div>
</main>
@stop