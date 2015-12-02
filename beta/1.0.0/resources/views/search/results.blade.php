@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1>Résultats</h1>
    @foreach($results as $result)
        {!! var_dump($result) !!}
    @endforeach
@stop