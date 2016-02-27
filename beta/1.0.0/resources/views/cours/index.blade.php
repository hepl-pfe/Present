@extends('layouts.teacher_layout')
@section('title', 'Mes cours')
@section('teacher_content')
    <div>
        <a href="{!! URL::action('Www\CoursController@create') !!}" class="btn btn--blue-svg">
            <svg class="svg-basic svg--white">
                <use xlink:href="#shape-create"></use>
                <span>Créer un cours</span>
            </svg>
        </a>
        @unless(empty(Auth::user()->cours->toArray()))
            <a href="{!! URL::action('Www\PresentController@getPlanificateFull') !!}" class="btn btn--blue-svg">
                <svg class="svg-basic svg--white">
                    <use xlink:href="#shape-calendar"></use>
                    <span>Planifier une séance de cours </span>
                </svg>
            </a>
        @endunless
        @if(Auth::user()->hasOccurrence)
            <a href="{!! URL::action('Www\PresentController@index') !!}" class="btn btn--blue-svg">
                <svg class="svg-basic svg--white">
                    <use xlink:href="#shape-to-do"></use>
                    <span>Prendre les présences</span>
                </svg>
            </a>
        @endif
    </div>
    <ul class="layout">
        @foreach($cours as $cour)
            @if(empty($cours->toArray()))
                <div class="informative-box">
                    <p class="informative-box__text">Pas encore de
                        <b>Classes</b>? {!! link_to_action('Www\ClassController@create','Créer une classe',[],['class'=>'']) !!}
                    </p>
                </div>
            @else
                <li class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
                    <div class="box">
                        <div class="box-header beta">
                            {!! Html::linkAction('Www\CoursController@show',$cour->name,['slug'=>$cour->slug],['class'=>'link-spacer']) !!}
                            <div>
                                <a href="{!! URL::action('Www\CoursController@edit',['id'=>$cour->id]) !!}"
                                   data-toggle="tooltip" title="Modifier le cours : {!! $cour->name !!}">
                                    <svg class="svg-basic svg--blue">
                                        <use xlink:href="#shape-edit"></use>
                                    </svg>
                                    <span class="visuallyhidden">Modifier le cours : {!! $cour->name !!}</span>
                                </a>
                                {!!  Form::open(['action' => ['Www\CoursController@destroy', $cour->id], 'method' => 'delete','class'=>'inline']) !!}
                                <button class="link--alert"
                                        data-toggle="tooltip" title="Supprimer le cours : {!! $cour->name !!}">
                                    <svg class="svg-basic svg--alert">
                                        <use xlink:href="#shape-trash"></use>
                                    </svg>
                                    <span class="visuallyhidden">Supprimer le cours : {!! $cour->name !!}</span>
                                </button>
                                {!! Form::close() !!}
                                <a href="{!! URL::action('Www\PresentController@getPlanificateFullWithCours',['cours_slug'=>$cour->slug]) !!}"
                                   data-toggle="tooltip"
                                   title="Planifier une séance à partir du cours : {!! $cour->name !!}">
                                    <svg class="svg-basic svg--blue">
                                        <use xlink:href="#shape-calendar"></use>
                                    </svg>
                                    <span class="visuallyhidden">Planifier une séance à partir du cours : {!! $cour->name !!}</span>
                                </a>
                            </div>
                        </div>
                        <p><i class="meta-info">Decription&nbsp;:</i> {!! $cour->description !!}</p>

                        @if(!is_null($cour->classes))
                            <ul>
                                @foreach($cour->classes as $class)
                                    <li>
                                        Classe&nbsp;: {!! link_to_action('Www\ClassController@show',$class->name,[$class->slug],[]) !!}</li>
                                @endforeach
                            </ul>
                        @else
                            <p class="alert-danger--soft">Le cours <i>{!! ' '.$cour->name.' ' !!}</i> n’a pas encore de
                                classe. {!! Html::linkAction('Www\ClassController@create','Créer une classe') !!}</p>
                        @endif
                    </div>
                </li>
            @endif
        @endforeach
    </ul>
    {!! $cours->render() !!}
@stop