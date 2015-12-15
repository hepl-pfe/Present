@extends('layouts.master_layout')
@section('content')
    @include('partials.nav.visitors_nav')
    <h1 class="visuallyhidden">Présent, l’outil indispensable pour une gestion efficace des présences.</h1>
    <div class="welcome-container">
        {!! Form::open(['url'=>'auth/login','class'=>'welcome-form']) !!}
            <h2>S’identifier</h2>
            @include('forms.users.auth.login')
        {!! Form::close() !!}
    </div>
@endsection