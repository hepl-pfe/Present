@extends('layouts.teacher_layout')
@section('teacher_content')
<h1>Mes groupes</h1>
<ul>
    <li>{!! link_to('/eleves/blisntin-stephan','Blisntin Stéphan',['class'=>'','title'=>'Blisntin Stéphan']) !!}</li>
    <li>{!! link_to('/eleves/blisntin-stephan','Armound Adeline',['class'=>'','title'=>'Blisntin Stéphan']) !!}</li>
    <li>{!! link_to('/eleves/blisntin-stephan','Crutzen Marie',['class'=>'','title'=>'Blisntin Stéphan']) !!}</li>
    <li>{!! link_to('/eleves/blisntin-stephan','Delayen Estelle',['class'=>'','title'=>'Blisntin Stéphan']) !!}</li>
    <li>{!! link_to('/eleves/blisntin-stephan','Chateux Claude',['class'=>'','title'=>'Blisntin Stéphan']) !!}</li>
    <li>{!! link_to('/eleves/blisntin-stephan','Thury Michel',['class'=>'','title'=>'Blisntin Stéphan']) !!}</li>
    <li>{!! link_to('/eleves/blisntin-stephan','Mannekin Jan',['class'=>'','title'=>'Blisntin Stéphan']) !!}</li>
    <li>{!! link_to('/eleves/blisntin-stephan','Blistin Stéphane',['class'=>'','title'=>'Blisntin Stéphan']) !!}</li>
</ul>
@stop