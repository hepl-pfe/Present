@extends('layouts.teacher_layout')
@section('teacher_content')
    <div>
        <h1 class="big-page-header">Mes cours</h1>
        {!! link_to_action('Www\CoursController@create','Créer un cours',[],['class'=>'btn btn--soft']) !!}
        @unless(empty(Auth::user()->cours->toArray()))
            {!! Html::linkAction('Www\UserController@getPlanificateFull','Planifier une séance de cours ',[],['class'=>'btn btn--soft','title'=>'Planifier']) !!}
        @endunless
        @if(Auth::user()->hasOccurrence)
            {!! Html::linkAction('Www\PresentController@index','Prendre les présences',[],['class'=>'btn btn--soft','title'=>'Planifier']) !!}
        @endif
    </div>
<ul class="layout">
    @foreach($cours as $cour)
    @if(empty($cours->toArray()))
        <div class="informative-box">
            <p class="informative-box__text">Pas encore de <b>Classes</b>? {!! link_to_action('Www\ClassController@create','Créer une classe',[],['class'=>'']) !!}</p>
        </div>
    @else
            <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
                <div class="box-header beta">
                    <h2>{!! $cour->name !!}</h2>
                    <a href="{!! URL::action('Www\CoursController@edit',['id'=>$cour->id]) !!}" class=""
                       data-toggle="tooltip" title="Ajouter un cours">
                        <svg class="svg-basic svg--blue">
                            <use xlink:href="#shape-edit"></use>
                        </svg>
                    </a>
                    <a href="{!! URL::action('Www\CoursController@destroy',['id'=>$cour->id]) !!}" class=""
                       data-toggle="tooltip" title="Ajouter un cours">
                        <svg class="svg-basic svg--alert">
                            <use xlink:href="#shape-trash"></use>
                        </svg>
                    </a>
                </div>
                <div class="box">
                    <ul>
                        @foreach($cour->classes as $class)
                            <li>{!! link_to_action('Www\ClassController@show',$class->name,[$class->slug],[]) !!}</li>
                        @endforeach
                    </ul>
                    {!!  Form::open(['action' => ['Www\CoursController@destroy', $cour->id], 'method' => 'delete','class'=>'inline']) !!}
                    {!! Form::submit('Supprimer le cours',['class'=>'btn btn--alert btn--small']) !!}
                    {!! Form::close() !!}
                </div>
            </li>
    @endif
@endforeach
</ul>
@stop