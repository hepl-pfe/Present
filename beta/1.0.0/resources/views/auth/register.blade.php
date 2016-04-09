@extends('layouts.master_layout')
@section('title', 'S’inscrire')
@section('content')
    @include('partials.nav.visitors_nav')
    <div class="welcome-container">
        <h2 class="alpha">S’inscrire</h2>
        @include('forms.partials.social-link')
        {!! Form::open( ['action','Auth\AuthController@postRegister','class'=>'welcome-form pos-rel']) !!}
        @include('forms.users.auth.register')
        {!! Form::close() !!}
        <p class="welkcome-caption">Vous êtes déjà membre ? {!! Html::linkAction('Auth\AuthController@getLogin','Identifiez-vous',[],['class'=>'']) !!}</p>
    </div>
@endsection