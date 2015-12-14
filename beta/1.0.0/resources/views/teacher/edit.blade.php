@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">{!! $user->first_name !!}&nbsp;{!! $user->last_name !!}</h1>
{!! Form::model($user,['action' => ['Www\UserController@update',$user->id],'method'=>'patch','enctype'=>'multipart/form-data']) !!}
        @include('forms.users.edit',['submit'=>'Mettre à jour vos informations personnelles'])
{!! Form::close() !!}
@stop