@extends('layouts.master_layout')
@section('content')
    @if (session('status'))
        <div class="alert alert-success">
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

