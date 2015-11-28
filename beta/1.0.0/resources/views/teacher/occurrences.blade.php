@extends('layouts.teacher_layout')
@section('teacher_content')
    <div>
        <h1 class="big-page-header">{!! $cour->name !!}</h1>
    </div>
    @foreach($students as $student)
        @include('partials.students.students',['name'=>$student->first_name.' '.$student->last_name,'slug'=>$student->slug])
    @endforeach
@stop