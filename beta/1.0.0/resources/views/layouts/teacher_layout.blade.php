@extends('layouts.master_layout')
@section('content')
    @include('partials.panel.teacher_actions')
    @include('partials.nav.teacher_nav')
    <div class="main-content">
        @if (Session::has('flash_notification.message'))
            <div class="alert alert-{{ Session::get('flash_notification.level') }}">
                <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
                {{ Session::get('flash_notification.message') }}
            </div>
        @endif
        @if(Session::has('flash_message'))
            <div class="message-box">
                <p>{!! Session::get('flash_message') !!}</p>
            </div>
        @endif
        <div class="header-for-mobile accessibility--lap visuallyhidden--lap-and-up">@yield('title')</div>
        @yield('teacher_content')
    </div>
@stop