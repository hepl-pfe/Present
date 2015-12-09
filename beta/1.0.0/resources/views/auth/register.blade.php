@extends('layouts.master_layout')
@section('content')
    @extends('layouts.welkocome_layout')
        @section('form-content')
            {!! Form::open( ['action','Auth\AuthController@postRegister','class'=>'welcome-form']) !!}
                <h2>S’inscrire</h2>
                @include('forms.users.auth.register')
            {!! Form::close() !!}
        @endsection
@endsection

