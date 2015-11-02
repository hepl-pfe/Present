@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1>Stephan Blisntin</h1>
    <div>
        <img src="" alt="" class="media__img">
        <dl>
            <dt>Classe :</dt>
            <dd>2F</dd>
            <dt>Section :</dt>
            <dd>Générale</dd>
            <dt>Date de naissance :</dt>
            <dd>8 janvier 2000 ( 15 ans) </dd>
        </dl>
    </div>
    <div>
        {!! Form::open(['/']) !!}
            @include('forms.students.add_notes')
        {!! Form::close() !!}
    </div>
    <div>
        <h2>Notes relative au cours</h2>
        <ul>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.Mauris maximus nisl nec vulputate maximus</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.Mauris maximus nisl nec vulputate maximus</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.Mauris maximus nisl nec vulputate maximus</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.Mauris maximus nisl nec vulputate maximus</li>
        </ul>
    </div>
    <div>
        <h2>Notes relative à l’année</h2>
        <ul>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.Mauris maximus nisl nec vulputate maximus</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.Mauris maximus nisl nec vulputate maximus</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.Mauris maximus nisl nec vulputate maximus</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.Mauris maximus nisl nec vulputate maximus</li>
        </ul>
    </div>
    <div>
        <h2>Notes relative ....</h2>
        <ul>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.Mauris maximus nisl nec vulputate maximus</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.Mauris maximus nisl nec vulputate maximus</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.Mauris maximus nisl nec vulputate maximus</li>
            <li>Lorem ipsum dolor sit amet, consectetur adipiscing elit.Mauris maximus nisl nec vulputate maximus</li>
        </ul>
    </div>

@stop