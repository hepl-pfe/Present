@extends('layouts.master_layout')
@section('title', 'S’inscrire')
@section('content')
    <div class="layout column-container">
        <div class="layout__item u-6/12 column u-12/12-palm column--red">
            <div class="presentation-logo">
                @include('partials.nav.visitors_nav')
            </div>
            <h1 class="vertical-align-header">L’outil indispensable pour une gestion efficace des présences.</h1>
        </div>
        <div class="layout__item u-6/12 u-12/12-palm column column--blue">
            <div class="welcome-log">
                <h2>S’identifier</h2>
                {!! Form::open(['url' => '/']) !!}
                @include('forms.users.login')
                {!! Form::close() !!}
            </div>
        </div>
    </div>
@endsection