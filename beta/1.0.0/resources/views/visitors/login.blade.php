@extends('layout')
@section('title', 'S’inscrire')
@include('partials.nav.visitors_nav')
@section('content')
<h1>S’identifier</h1>
    @include('forms.users.login')
@endsection
