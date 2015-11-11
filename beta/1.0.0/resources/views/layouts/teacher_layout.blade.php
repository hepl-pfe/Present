@extends('layouts.master_layout')
@section('content')
<div role="header" class="main-header">
    @include('partials.panel.teacher_controller')
</div>
<main class="layout">
@include('partials.nav.teacher_nav')
<div class="layout__item u-10/12-desk u-10/12-lap u-12/12-palm main-content">
    @if(Session::has('flash_message'))
    <div class="message-box">
        <p>{!! Session::get('flash_message') !!}</p>
      {!! Html::link('http://localhost:3000/cours/français','Prendre les présences',['class'=>'btn']) !!}
    </div>
    @endif
    @yield('teacher_content')
</div>
</main>
@stop