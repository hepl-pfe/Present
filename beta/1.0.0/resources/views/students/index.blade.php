@extends('layouts.teacher_layout')
@section('title', 'Mes élèves')
@section('teacher_content')
    @if(empty($students))
        <div class="informative-box">
            <p class="informative-box__text">Pas encore de
                <b>d’élève </b>? {!! link_to_action('Www\StudentController@create','Créer un élève',[],['class'=>'']) !!}
            </p>
        </div>
    @else
        <div class="layout">
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
            @foreach($students as $student)
                <div class="profile-container layout__item  u-3/12-desk u-4/12-lap u-12/12-palm">
                    <div class="profile-container__box box">
                        <a href="{!! URL::action('Www\StudentController@show',['slug'=>$student->slug]) !!}"
                           title="Renvoie vers la fiche de l’élèves {{ $student->fullname }}" class="media">
                            <img class="profile-picture media__img user-image profile-picture--present"
                                 src="{!! asset('./img/default_profile_picture.jpg') !!}" alt="Image de l’élève {{ $student->fullname }}" width="50px" height="50px">
                            <div class="media__body">
                                <span class="profile-name">{!! $student->first_name !!}</span>
                                <span class="profile-name">{!! $student->last_name !!}</span>
                            </div>
                        </a>
                        <dl class="">
                            <dt>Appartient à la classe :</dt>
                            <dd>
                                @foreach($student->classes as $class)
                                    {!! Html::linkAction('Www\ClassController@show',$class->name,['classe_slug'=>$class->slug]) !!}
                                @endforeach</dd>
                            <dt>Ses cours :</dt>
                            <dd>
                                @foreach($student->classes as $classe)
                                    @foreach($classe->cours as $cour)
                                        {!! Html::linkAction('Www\CoursController@show',$cour->name,['cour_slug'=>$cour->slug]) !!}
                                    @endforeach
                                @endforeach</dd>
                        </dl>
                    </div>
                </div>
            @endforeach
        </div>
        {!! $students->render() !!}
    @endif
@stop