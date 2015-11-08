@extends('layouts.master_layout')
@section('content')
@extends('layouts.welkocome_layout')
@section('form-content')
	@if (session('status'))
		<div class="alert alert-success">
			{{ session('status') }}
		</div>
	@endif
	<form class="form-horizontal" role="form" method="POST" action="{{ url('/password/email') }}">

	</form>
@endsection
@endsection
