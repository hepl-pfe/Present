@extends('layouts.master_layout')
@section('content')
    @extends('layouts.welkocome_layout')
@section('form-content')
    <h2>S’inscrire</h2>
    {!! Form::open( ['action','Auth\AuthController@postRegister','class'=>'welcome-form']) !!}
    @include('forms.users.auth.register')
    {!! Form::close() !!}
@endsection
@endsection
