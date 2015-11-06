@extends('layouts.master_layout')
@section('title', 'S’inscrire')
@include('partials.nav.visitors_nav')
@section('content')
    <div class="layout">
        <div class="layout__item u-6/12"><h1>jhsjkhskhjkshkjsjkshkj</h1></div>
        <div class="layout__item u-6/12">
            {!! Form::open(['url' => '/']) !!}
            @include('forms.schools.register')
            {!! Form::close() !!}
        </div>
    </div>
@endsection