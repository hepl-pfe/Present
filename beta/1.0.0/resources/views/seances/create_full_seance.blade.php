@extends('layouts.teacher_layout')
@section('title', 'Planifier des séances de cours')
@section('teacher_content')
    @if($isAllowToPlannificate)
        @if(isset($cour))
            <div class="meta-header">Pour le cours
                de&nbsp;: {!! Html::linkAction('Www\CoursController@show',$cour->name,['slug'=>$cour->slug],['class'=>'link-spacer']) !!}</div>
        @endif
        {!! Form::open(['action' => 'Www\PresentController@storePlanificateFull']) !!}
        @include('forms.seances.create_full_seance',['submit'=>'Planifier ses séances de cours'])
        {!! Form::close() !!}
    @else
        <?php
        if ((!$hasCours) && (!$hasClasses)) {
            $actions = Html::linkAction('Www\CoursController@create', 'créer un cours', [], ['data-form' => 'create-cours-form']) . ' et ' . Html::linkAction('Www\ClassController@create', 'créer une classe', [], ['data-form' => 'create-classe-form']);
        } elseif (!$hasClasses) {
            $actions = Html::linkAction('Www\ClassController@create', 'créer une classe', [], ['data-form' => 'create-classe-form']);
        } else {
            $actions = Html::linkAction('Www\CoursController@create', 'créer un cours', [], ['data-form' => 'create-cours-form']);
        }
        ?>
        @include('forms.partials.base-info--important',['message'=>'Attention : afin de planifier une séance de cours il faut au préalable, '.$actions.''])
        <div class="box-wrapper">
            <div class="form-hidde create-classe-form">
                {!! Form::open(['action' => 'Www\ClassController@store','enctype'=>'multipart/form-data','class'=>'']) !!}
                <a href="#" data-form="create-classe-form" class="hide-modal--top">
                    <svg class="hide-modal--top__svg svg--alert">
                        <use xlink:href="#shape-close-modal"></use>
                    </svg>
                    <span class="visuallyhidden">fermer la fenêtre</span>
                </a>
                @include('forms.class.create',['submit'=>'Créer la classe'])
                <a href="#" data-form="create-classe-form">fermer la fenêtre</a>
                {!! Form::close() !!}
            </div>
            <div class="form-hidde create-cours-form">
                {!! Form::open(['action' => 'Www\CoursController@store','enctype'=>'multipart/form-data','class'=>'']) !!}
                <a href="#" data-form="create-cours-form" class="hide-modal--top">
                    <svg class="hide-modal--top__svg svg--alert">
                        <use xlink:href="#shape-close-modal"></use>
                    </svg>
                    <span class="visuallyhidden">fermer la fenêtre</span>
                </a>
                @include('forms.cours.create',['submit'=>'Créer le cours'])
                <a href="#" data-form="create-cours-form">fermer la fenêtre</a>
                {!! Form::close() !!}
            </div>
        </div>
    @endif
@stop