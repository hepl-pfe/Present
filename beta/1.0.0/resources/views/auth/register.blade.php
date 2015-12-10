@extends('layouts.master_layout')
@section('content')
    <h1 class="visuallyhidden">Présent, l’outil indispensable pour une gestion efficace des présences.</h1>
    <div class="welcome-container">
        {!! Form::open( ['action','Auth\AuthController@postRegister','class'=>'welcome-form']) !!}
            <h2>S’inscrire</h2>
            @include('forms.users.auth.register')
        {!! Form::close() !!}
    </div>
@endsection