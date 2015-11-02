@extends('layouts.teacher_layout')
@section('teacher_content')
<ul>
    <li>
        <h2>{!! link_to('cours/français','Français',['class'=>'']) !!}</h2>
        <ul>
            <li>08:20 cours avec les 2F</li>
            <li>08:20 cours avec les 2F</li>
            <li>08:20 cours avec les 2F</li>
            <li>08:20 cours avec les 2F</li>
            <li>08:20 cours avec les 2F</li>
        </ul>
    </li>
    <li>
        <h2>{!! link_to('cours/français','Théatre',['class'=>'']) !!}</h2>
        <ul>
            <li>08:20 cours avec les 2F</li>
            <li>08:20 cours avec les 2F</li>
            <li>08:20 cours avec les 2F</li>
            <li>08:20 cours avec les 2F</li>
            <li>08:20 cours avec les 2F</li>
        </ul>
    </li>
    <li>
        <h2>{!! link_to('cours/français','Expression écrite',['class'=>'']) !!}</h2>
        <ul>
            <li>08:20 cours avec les 2F</li>
            <li>08:20 cours avec les 2F</li>
            <li>08:20 cours avec les 2F</li>
            <li>08:20 cours avec les 2F</li>
            <li>08:20 cours avec les 2F</li>
        </ul>
    </li>
    <li>
        <h2>{!! link_to('#','Ajouter un cours',['class'=>'']) !!}</h2>
    </li>
</ul>
@stop