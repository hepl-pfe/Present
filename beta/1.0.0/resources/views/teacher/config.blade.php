@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">{!! $user->first_name !!}&nbsp;{!! $user->last_name !!}</h1>
<div class="media section">
    <img src="{!! asset('img/default_profile_picture.jpg') !!}" alt="" class="media__img user-image user-image--medium">
    <dl class="media-body">
        <dt>Prénom :</dt>
        <dd>{!! $user->first_name !!}</dd>
        <dt>Nom de famille :</dt>
        <dd>{!! $user->last_name !!}</dd>
        <dt>Adresse mail :</dt>
        <dd>{!! $user->email !!}</dd>
    </dl>
    {!! Form::open(['/']) !!}
    {!! Form::label('link_name','Nom du lien',['class'=>'']) !!}
    {!! Form::input('text','link_name','',['class'=>'']) !!}
    {!! Form::label('link_value','Valeur du lien',['class'=>'']) !!}
    {!! Form::input('text','link_value','',['class'=>'']) !!}
    {!! Form::submit('Ajouter le lien',['class'=>'']) !!}
    {!! Form::close() !!}
</div>
@stop