@extends('layouts.master_layout')
@section('content')
    @extends('layouts.welkocome_layout')
    @section('form-content')
        <h2>S’identifier</h2>
        {!! Form::open(['url'=>'auth/login']) !!}
            @include('forms.users.auth.login')
        {!! Form::close() !!}
    @endsection
@endsection
