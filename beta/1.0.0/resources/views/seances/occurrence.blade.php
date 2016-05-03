@extends('layouts.teacher_layout')
@section('title', $cour->name)
@section('teacher_content')
    {!! Form::open(['action'=>['Www\PresentController@storeClassePresent',$occurrence->id]]) !!}
    <div class="header-action-box">
        {!! Form::submit('Finir les présences',['class'=>'btn block btn--spacer']) !!}
        <p>Les présences du&nbsp;: <time datetime="{!! $occurrence->from_hour->toW3cString() !!}">{!! $occurrence->from_hour->formatLocalized('%A %d %B %Y') !!}</time></p>
    </div>
    <div class="layout">
        <?php $i=0; ?>
        @foreach($students as $student)
                <?php ++$i; ?>
            <div class="profile-container layout__item  u-3/12-desk u-4/12-lap u-12/12-palm is_present">
                <select name="{{ $student->id }}" id="student_id_{{ $student->id }}"
                        class="mask visuallyhidden" data-type="select">
                    @foreach($statuts as $statut)
                        <?php $selectInfo = !!$statut->is_default ? 'Default' : 'undefined' ?>
                        <option value="{!! $statut->id !!}"
                                data-info-select="{!! $selectInfo !!}"
                                data-info-color="{{ $statut->color }}"
                                data-info-name="{{ $statut->name }}"
                                data-info-selector=".statut-{{ $i }}">{!! $statut->name !!}</option>
                    @endforeach
                </select>
                <div class="profile-container__box box">
                    <a href="{!! URL::action('Www\StudentController@show',['slug'=>$student->slug]) !!}"
                       title="Renvoie vers la fiche de l’élèves" class="media statut-{{ $i }}">
                        <img class="profile-picture media__img user-image profile-picture--present"
                             src="{!! asset('./img/default_profile_picture.jpg') !!}" alt=""
                             style="border-color: {{$defaultStatut->color}}" width="50px" height="50px">
                        <div class="media__body">
                            <span class="profile-name">{!! $student->first_name !!}</span>
                            <span class="profile-name">{!! $student->last_name !!}</span>
                        </div>
                    </a>
                    <div class="statut-{{ $i }}">
                        <span class="color-box" style="background-color:{{ $defaultStatut->color }}"></span>
                        <span>{{ $defaultStatut->name }}</span>
                    </div>
                </div>
            </div>
        @endforeach
    </div>
    <div class="header-action-box">
        {!! Form::submit('Finir les présences',['class'=>'btn block btn--spacer']) !!}
        <p>Les présences du&nbsp;: <time datetime="{!! $occurrence->from_hour->toW3cString() !!}">{!! $occurrence->from_hour->formatLocalized('%A %d %B %Y') !!}</time></p>
    </div>
    {!! Form::close() !!}
@stop