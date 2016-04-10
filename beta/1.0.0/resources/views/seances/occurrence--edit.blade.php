@extends('layouts.teacher_layout')
@section('title', $cour->name)
@section('teacher_content')
    {!! Form::open(['action'=>['Www\PresentController@editClassePresent',$occurrence->id],'method' => 'patch'])
    !!}
    <div class="header-action-box">
        {!! Form::submit('Finir les présences',['class'=>'btn block']) !!}
    </div>
    <div class="layout">
        @foreach($occurrence->presents as $present)
            <div class="profile-container layout__item  u-3/12-desk u-4/12-lap u-12/12-palm is_present">
                <select name="{{ $present->id }}-{{ $present->student->id }}" id="student_id_{{ $present->student->id }}"
                        class="mask visuallyhidden" data-type="select">
                    @foreach($statuts as $statut)
                        <?php $selectInfo = !!$statut->is_default ? 'Default' : 'undefined' ?>
                        <option value="{!! $statut->id !!}"
                                <?php echo($present->statut->id==$statut->id ?'selected':''); ?>
                                data-info-select="{!! $selectInfo !!}"
                                data-info-color="{{ $statut->color }}"
                                data-info-name="{{ $statut->name }}"
                                data-info-selector=".statut-{{ $present->id }}">{!! $statut->name !!}</option>
                    @endforeach
                </select>
                <div class="profile-container__box box">
                    <a href="{!! URL::action('Www\StudentController@show',['slug'=>$present->student->slug]) !!}"
                       title="Renvoie vers la fiche de l’élèves" class="media statut-{{ $present->id }}">
                        <img class="profile-picture media__img user-image profile-picture--present"
                             src="{!! asset('./img/default_profile_picture.jpg') !!}" alt=""
                             style="border-color: {{$present->statut->color}}" width="50px" height="50px">
                        <div class="media__body">
                            <span class="profile-name">{!! $present->student->first_name !!}</span>
                            <span class="profile-name">{!! $present->student->last_name !!}</span>
                        </div>
                    </a>
                    <div class="statut-{{ $present->id }}">
                        <span class="color-box" style="background-color:{{ $present->statut->color }}"></span>
                        <span>{{ $present->statut->name }}</span>
                    </div>
                </div>
            </div>
        @endforeach
    </div>
    {!! Form::close() !!}
@stop