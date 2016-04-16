@extends('layouts.teacher_layout')
@section('title', 'Mon compte')
@section('teacher_content')
{!! Form::model($user,['action' => ['Www\UserController@update',$user->id],'method'=>'patch','enctype'=>'multipart/form-data','runat'=>'server']) !!}
        @include('forms.users.edit',['submit'=>'Mettre à jour vos informations personnelles'])
{!! Form::close() !!}
{!! Form::model($user,['action' => ['Www\UserController@updatePassword'],'method'=>'patch']) !!}
        @include('forms.users.update-password',['submit'=>'Changer votre mot de passe'])
{!! Form::close() !!}
@stop