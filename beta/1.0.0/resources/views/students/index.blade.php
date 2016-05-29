@extends('layouts.teacher_layout')
@section('title', 'Mes élèves')
@section('teacher_content')
    @include('partials.panel.index_actions')
    <div class="layout">
        @foreach($students as $student)
            <div class="profile-container layout__item  u-3/12-desk u-4/12-lap u-12/12-palm">
                @include('modals.students.one-student')
            </div>
        @endforeach
    </div>
    @if(0==$students->toArray()['total'])
        <div class="informative-box">
            <p class="informative-box__text">Vous n’avez pas encore d’élèves.</p>
        </div>
    @endif
    @include('pagination.default', ['paginator' => $students])
@stop