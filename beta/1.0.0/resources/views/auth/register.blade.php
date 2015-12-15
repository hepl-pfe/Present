@extends('layouts.master_layout')
@section('content')
    @include('partials.nav.visitors_nav')
    <div class="welcome-container">
        {!! Form::open( ['action','Auth\AuthController@postRegister','class'=>'welcome-form pos-rel']) !!}
        <h1>S’inscrire</h1>
        <div class="register-callout-user-register">
            <svg class="svg--avatar svg--avatar--user-registers">
                <use xlink:href="#shape-callout-user-register"></use>
            </svg>
        </div>
        @include('forms.users.auth.register')
        {!! Form::close() !!}
    </div>
@endsection