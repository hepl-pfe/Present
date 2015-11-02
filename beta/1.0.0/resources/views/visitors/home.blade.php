@extends('layouts.master_layout')
@section('title', 'S’inscrire')
@include('partials.nav.visitors_nav')
@section('content')
<h1>S’inscrire</h1>
    @include('forms.schools.register')
@endsection
