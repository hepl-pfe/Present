@extends('layouts.master_layout')
@section('content')
@extends('layouts.welkocome_layout')
@section('form-content')
	@if (session('status'))
		<div class="alert alert-success">
			{{ session('status') }}
		</div>
	@endif
    <h2>Redéfinir mon mot de passe</h2>
    {!! Form::open(['URL'=>'/password/email']) !!}
    @include('forms.users.auth.password')
    {!! Form::close() !!}
@endsection
@endsection
