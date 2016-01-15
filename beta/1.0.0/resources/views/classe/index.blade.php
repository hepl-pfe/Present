@extends('layouts.teacher_layout')
@section('teacher_content')
    <div>
        <h1 class="big-page-header">Mes classes</h1>
        <a href="{!! URL::action('Www\ClassController@create') !!}" class="btn btn--blue-svg">
            <svg class="svg-basic svg--white">
                <use xlink:href="#shape-create"></use>
                <span>Créer une classe</span>
            </svg>
        </a>
    </div>
    <ul class="layout">
        @foreach($classes as $classe)
            <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
                <ul class="box">
                    <li class="box-header beta">
                        {!! Html::linkAction('Www\ClassController@show',$classe->name,['slug'=>$classe->slug],['class'=>'link-spacer']) !!}
                        <a href="{!! URL::action('Www\ClassController@edit',['id'=>$classe->id]) !!}" class=""
                           data-toggle="tooltip" title="Éditer la classe de : {!! $classe->name !!}">
                            <svg class="svg-basic svg--blue">
                                <use xlink:href="#shape-edit"></use>
                            </svg>
                        </a>
                        {!!  Form::open(['action' => ['Www\ClassController@destroy', $classe->id], 'method' => 'delete','class'=>'inline']) !!}
                        <button class="link--alert"
                                data-toggle="tooltip" title="Supprimer la classe : {!! $classe->name !!}">
                            <svg class="svg-basic svg--alert">
                                <use xlink:href="#shape-trash"></use>
                            </svg>
                            <span class="visuallyhidden">Supprimer la classe {!! $classe->name !!}</span>
                        </button>
                        {!! Form::close() !!}
                    </li>
                    <li>
                        <ul>
                            @foreach($classe->students as $student)
                                <li>
                                    {!! link_to_action('Www\StudentController@show',$student->fullname,['slug'=>$student->slug],[]) !!}
                                </li>
                            @endforeach
                        </ul>
                    </li>
                </ul>
            </li>
        @endforeach
    </ul>
    {!! $classes->render() !!}
@stop