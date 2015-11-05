@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 big-page-header>Stephan Blisntin</h1>
<div>
    <img src="" alt="" class="media__img">
    <dl>
        <dt>mail :</dt>
        <dd>{!! '1@hotmail.com' !!}</dd>
        <dt>mail2 :</dt>
        <dd>{!! '1@hotmail.com' !!}</dd>
        <dt>Dropbox</dt>
        <dd>unLien.com</dd>
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