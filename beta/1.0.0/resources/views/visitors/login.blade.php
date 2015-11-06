@extends('layouts.master_layout')
@section('title', 'S’inscrire')
@section('content')
    <div class="layout column-container">
        <div class="layout__item u-6/12 column column--red">
            <div class="presentation-logo">
                @include('partials.nav.visitors_nav')
                <svg class="svg-basic svg-main-logo media__img--svg media__img">
                    <title>logo</title>
                    <use xlink:href="#logo"></use>
                </svg>
            </div>
            <h1>L’outil indispensable pour une gestion efficace des présences.</h1>
        </div>
        <div class="layout__item u-6/12 column column--blue">
            {!! Form::open(['url' => '/']) !!}
            @include('forms.schools.register')
            {!! Form::close() !!}
        </div>
    </div>
@endsection