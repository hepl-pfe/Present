@extends('layouts.master_layout')
@section('content')
    @extends('layouts.welkocome_layout')
    @section('form-content')
            {!! Form::open(['url'=>'auth/login','class'=>'welcome-form']) !!}
                <h2>S’identifier</h2>
                @include('forms.users.auth.login')
            {!! Form::close() !!}
    @endsection
@endsection
