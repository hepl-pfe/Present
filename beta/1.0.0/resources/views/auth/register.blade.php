@extends('layouts.master_layout')
@section('title', 'S’inscrire')
@section('content')
    @include('partials.nav.visitors_nav')
    <div class="welcome-container">
        {!! Form::open( ['action','Auth\AuthController@postRegister','class'=>'welcome-form pos-rel']) !!}
        <h2>S’inscrire</h2>
        @include('forms.partials.social-link')
        @include('forms.users.auth.register')
        {!! Form::close() !!}
    </div>
@endsection