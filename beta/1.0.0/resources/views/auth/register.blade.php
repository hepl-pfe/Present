@extends('layouts.master_layout')
@section('content')
    @extends('layouts.welkocome_layout')
@section('form-content')
    <h2>S’inscrire</h2>
    {!! Form::open( array('action','Auth\AuthController@postRegister')) !!}
    @include('forms.users.auth.register')
    {!! Form::close() !!}
@endsection
@endsection
