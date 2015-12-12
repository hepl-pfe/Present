@extends('layouts.teacher_layout')
@section('teacher_content')
    <h1 class="big-page-header">La classe : <i>{!! $classe->name !!}</i></h1>
    <ul class="places-box list-block list-block--small">
        @foreach($classe->occurrences as $occurrence)
            <li class="list-block__item--small places__item">Le {!! $occurrence->from->toFormattedDateString() !!}
                de {!! $occurrence->from_hour->toTimeString() !!}
                à {!! $occurrence->to_hour->toTimeString() !!} le cours de
                <i>{!! Html::linkAction('Www\CoursController@show',$occurrence->cour->name,['cour_slug'=>$occurrence->cour->slug]) !!}</i>
            </li>
        @endforeach
    </ul>
@stop