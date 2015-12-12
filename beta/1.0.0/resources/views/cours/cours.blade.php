@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1 class="big-page-header">Cours <i>{!! $cour->name !!}</i></h1>
    <ul class="places-box list-block list-block--small">
        @foreach($cour->occurrences as $occurrence)
            <li class="list-block__item--small places__item">Le {!! $occurrence->from->toFormattedDateString() !!}
                de {!! $occurrence->from_hour->toTimeString() !!}
                à {!! $occurrence->to_hour->toTimeString() !!} la classe de
                <i>{!! Html::linkAction('Www\ClassController@show',$occurrence->classe->name,['classe_slug'=>$occurrence->classe->slug]) !!}</i>
            </li>
        @endforeach
    </ul>
@stop