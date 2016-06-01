@extends('layouts.teacher_layout')
@section('title', 'Mes élèves')
@section('teacher_content')
    @include('partials.panel.index_actions')
    <div class="layout">
        @if($students->count()<1)
            <div class="layout__item u-6/12-desk u-12/12-lap u-12/12-palm">
                @include('forms.partials.base-info--important',['message'=>'C’est ici que vous retrouverez tous vos élèves.'])
            </div>
        @else
            @foreach($students as $student)
                <div class="profile-container layout__item  u-3/12-desk u-4/12-lap u-12/12-palm">
                    @include('modals.students.one-student')
                </div>
            @endforeach
        @endif

    </div>

    @include('pagination.default', ['paginator' => $students])
@stop