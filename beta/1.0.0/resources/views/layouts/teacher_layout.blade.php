@extends('layouts.master_layout')
@section('content')
<div class="">
@include('partials.panel.teacher_controller')
@include('partials.nav.teacher_nav')

</div>
    @yield('teacher_content')
@stop