@extends('layouts.master_layout')
@section('title', 'S’identifier')
@section('content')
    @include('partials.nav.visitors_nav')
    <h1 class="visuallyhidden">Présent, l’outil indispensable pour une gestion efficace des présences.</h1>
    <div class="welcome-container">
        <h2 class="alpha">S’identifier</h2>
        @include('forms.partials.social-link')
        {!! Form::open(['url'=>'auth/login','class'=>'welcome-form']) !!}
        @include('forms.users.auth.login')
        {!! Form::close() !!}
        <p class="welkcome-caption">Vous n’êtes pas encore membre ?  {!! Html::linkAction('Auth\AuthController@getRegister','Inscrivez-vous',[],['class'=>'']) !!}</p>
    </div>
@endsection