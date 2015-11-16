@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1 class="big-page-header">Créer  un local</h1>
    {!! Form::open(array('action' => 'Www\RoomController@store')) !!}
     @include('forms.rooms.create')
    {!! Form::close() !!}
@stop