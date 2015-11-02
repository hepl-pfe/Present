@extends('layouts.master_layout')
@section('content')
@include('partials.panel.teacher_controller')
@include('partials.nav.teacher_nav')
    @yield('teacher_content')
@stop