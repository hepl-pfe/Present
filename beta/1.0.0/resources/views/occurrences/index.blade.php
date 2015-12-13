@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1 class="big-page-header">Mes présences</h1>
    <div class="layout">
        @foreach($occurrences as $occurrence)
            @if(false)
                <div class="informative-box">
                    <p class="informative-box__text">Pas encore de
                        <b>Classes</b>? {!! link_to_action('Www\ClassController@create','Créer une classe',[],['class'=>'']) !!}
                    </p>
                </div>
            @else
                @unless($occurrence->is_closed==1)
                    <div class="box-container layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
                        <div class="box">
                            <h2 class="box-header">{!! Auth::user()->cours->find($occurrence->cour_id)->name !!}</h2>
                            <p><span class="visuallyhidden">Le cours se donnera </span>
                                <time datetime="{!! $occurrence->from_hour->toW3cString() !!}">{!! $occurrence->from_hour->toDayDateTimeString() !!}</time>
                            </p>
                            <a href="{!! URL::action('Www\PresentController@getAllStudentfromOneOccurrence',['id'=>$occurrence->id]) !!}"
                               class="btn btn--blue-svg">
                                <svg class="svg-basic svg--white">
                                    <use xlink:href="#shape-to-do"></use>
                                    <span>Prendre les présence</span>
                                </svg>
                            </a>
                        </div>
                    </div>
                @endunless
            @endif
        @endforeach
    </div>
@stop