@extends('layout')
@section('title', 'S’inscrire')
@include('partials.nav.visitors_nav')
@section('content')
<h1>S’enregistrer</h1>
    @include('forms.schools.register')
@endsection
