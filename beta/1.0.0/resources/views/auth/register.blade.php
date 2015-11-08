@extends('layouts.master_layout')
@section('content')
    @extends('layouts.welkocome_layout')
    @section('form-content')
    <h2>S’inscrire</h2>
    @include('errors.errors')
    {!! Form::open( ['url'=>'/auth/register']) !!}
    @include('forms.users.auth.register')
    {!! Form::close() !!}
    @endsection
@endsection
