@extends('layouts.master_layout')
@section('title', 'Redéfinir mon mot de passe')
@section('content')
    @include('partials.nav.visitors_nav')
    @if (session('status'))
        <div class="alert wrapper alert-success">
            {{ session('status') }}
        </div>
    @endif
    <div class="welcome-container">
        {!! Form::open(['URL'=>'/password/email','class'=>'welcome-form']) !!}
        <h2>Redéfinir mon mot de passe</h2>
        @include('forms.users.auth.password')
        {!! Form::close() !!}
    </div>
@endsection

