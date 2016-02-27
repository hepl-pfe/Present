@extends('layouts.master_layout')
@section('content')
<div class="main-header">
    @include('partials.panel.teacher_actions')
</div>
<div class="layout">
@include('partials.nav.teacher_nav')
<div class="layout__item u-10/12-desk u-10/12-lap u-12/12-palm main-content">
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
    @yield('teacher_content')
</div>
</div>
@stop