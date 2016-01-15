@extends('layouts.teacher_layout')
@section('teacher_content')
<h1 class="big-page-header">{!! $user->first_name !!}&nbsp;{!! $user->last_name !!}</h1>
<div class="media section">
    <img src="{!! asset('img/default_profile_picture.jpg') !!}" alt="" class="media__img user-image user-image--medium">
    <dl class="media-body">
        <dt>mail :</dt>
        <dd>{!! '1@hotmail.com' !!}</dd>
        <dt>mail2 :</dt>
        <dd>{!! '1@hotmail.com' !!}</dd>
        <dt>Dropbox</dt>
        <dd>unLien.com</dd>
    </dl>
</div>
@stop