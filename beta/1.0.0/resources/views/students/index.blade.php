@extends('layouts.teacher_layout')
@section('title', 'Mes élèves')
@section('teacher_content')
    <div class="header-action-box">
        <a href="{!! URL::action('Www\StudentController@create') !!}" class="btn btn--blue-svg">
            <svg class="svg-basic svg--white">
                <use xlink:href="#shape-create"></use>
                <span>Créer un élève</span>
            </svg>
        </a>
        <a href="{!! URL::action('Www\StudentController@getImportStudentsList') !!}" class="btn btn--blue-svg">
            <svg class="svg-basic svg--white">
                <use xlink:href="#shape-import"></use>
                <span>Importer une liste d’élève</span>
            </svg>
        </a>
    </div>
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