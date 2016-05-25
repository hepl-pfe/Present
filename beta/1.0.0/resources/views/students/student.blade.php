@extends('layouts.teacher_layout')
@section('title', $student->fullname)
@section('teacher_content')
    <div class="media section">
        <img src="{!! asset('img/default_profile_picture.jpg') !!}" alt=""
             class="media__img user-image user-image--medium">
        <a href="mailto:{{$student->email}}">{{ $student->email }}</a>
        <dl class="media-body">
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
    @if($student->presences->count()>1)
        <nav class="nav-tabs">
            <h2 class="visuallyhidden">Navigation des différents graphiques</h2>
            <a class="prevent-default nav-tabs__item nav-tabs__item--active" href="#tabs-1">Répartition des statuts de
                présences.</a><!--
            --><a class="prevent-default nav-tabs__item" href="#tabs-2">Répartition des cours par séances.</a><!--
            --><a class="prevent-default nav-tabs__item" href="#tabs-3">Répartition des présences en fonction des
                cours.</a>
        </nav>
        <div class="tab-container">


            {{--Répartition des statuts de présences.--}}
            <?php $iTotalSeances = 0;
            $statusTable = [];
            ?>
            @foreach($student->presences as $present)
                <?php ++$iTotalSeances; ?>
                <?php
                if (array_key_exists($present->statut->id, $statusTable)) {
                    $statusTable[ $present->statut->id ]['nbr'] += 1;
                } else {
                    $statusTable[ $present->statut->id ]['nbr'] = 1;
                    $statusTable[ $present->statut->id ]['color'] = $present->statut->color;
                    $statusTable[ $present->statut->id ]['name'] = $present->statut->name;
                }
                ?>
            @endforeach
            <div class="one-tab-container one-tab-container--active" id="tabs-1">
                <div id="piechart-{{$student->id}}"
                     <?php $ii = 0 ?>
                     @foreach($statusTable as $statut)
                     <?php $ii++; ?>
                     data-present_{{$ii}}="{{$ii}},{{$statut['name']}},{{$statut['nbr']}},{{$statut['color']}}"
                     @endforeach
                     class="piechart-seances graphique-container">
                </div>
            </div>

            {{--Répartition des cours par séances.--}}
            <?php $coursTable = []; ?>
            @foreach($student->presences as $present)
                <?php
                if (array_key_exists($present->occurrence->cour->id, $coursTable)) {
                    $coursTable[ $present->occurrence->cour->id ]['nbr'] += 1;
                } else {
                    $coursTable[ $present->occurrence->cour->id ]['nbr'] = 1;
                    $coursTable[ $present->occurrence->cour->id ]['name'] = $present->occurrence->cour->name;
                }
                ?>
            @endforeach
            <div class="one-tab-container" id="tabs-2">
                <div id="bar-chart-{{$student->id}}"
                     <?php $ii = 0 ?>
                     @foreach($coursTable as $cour)
                     <?php $ii++; ?>
                     data-present_{{$ii}}="{{$ii}},{{$cour['name']}},{{$cour['nbr']}}"
                     @endforeach
                     class="bar-chart-student graphique-container">
                </div>
            </div>
            {{--Répartion des statut par cours--}}
            <?php $coursAndSatutTabble = []; ?>
            @foreach($student->presences as $present)
                <?php
                if (array_key_exists($present->occurrence->cour->id, $coursAndSatutTabble)) {
                    $coursAndSatutTabble[ $present->occurrence->cour->id ]['TotalPresent'] += 1;
                    if (array_key_exists($present->statut->id, $coursAndSatutTabble[ $present->occurrence->cour->id ]['statuts'])) {
                        // incrémente les statuts existants
                        $coursAndSatutTabble[ $present->occurrence->cour->id ]['statuts'][ $present->statut->id ]['nbr'] += 1;
                    } else {
                        $coursAndSatutTabble[ $present->occurrence->cour->id ]['statuts'][ $present->statut->id ] = ['name' => $present->statut->name, 'colors' => $present->statut->color, 'nbr' => 1];
                        // Crée les deux autres statuts
                    }
                } else {
                    $coursAndSatutTabble[ $present->occurrence->cour->id ]['TotalPresent'] = 1;
                    $coursAndSatutTabble[ $present->occurrence->cour->id ]['name'] = $present->occurrence->cour->name;
                    $coursAndSatutTabble[ $present->occurrence->cour->id ]['statuts'][ $present->statut->id ] = ['name' => $present->statut->name, 'colors' => $present->statut->color, 'nbr' => 1];
                }
                ?>
            @endforeach
            <?php
            $statutI = 0;
            foreach (\Auth::user()->statuts as $statut) {
                ++$statutI;
                $coursAndSatutTabble['meta']['statuts'][] = ['id' => $statut->id, 'name' => $statut->name, 'color' => $statut->color];
            }
            $coursAndSatutTabble['meta']['max-statut'] = $statutI;
            ?>
            <div class="one-tab-container" id="tabs-3">
                <div id="bar-chart-2-{{$student->id}}"
                     data-graph="{{ htmlspecialchars(json_encode($coursAndSatutTabble), ENT_QUOTES, 'UTF-8') }}"
                     class="bar-chart-statuts-cours graphique-container"></div>
            </div>
        </div>
    @else
        <p>Cet élève n’a pas encore participé à un
            cours.
            @if(\Auth::user()->hasOccurrence)
                {!!  Html::linkAction('Www\PresentController@getPlanificateFull','Planifier une séance de cours!') !!}</p>
            @endif
    @endif

    <div class="section">
        {!! Form::open(['action'=>'Www\StudentController@storeNote']) !!}
        {!! Form::hidden('student_id',$student->id) !!}
        @include('forms.students.add_notes')
        {!! Form::close() !!}
    </div>
    @unless(empty($notes->toArray()))
        <div class="layout section">
            <div class="layout__item u-4/12 u-4/12-desk u-6/12-lap u-12/12-palm">
                <h2 class="header_note">Notes</h2>
                <ul class="list-block">
                    @foreach($notes as $note)
                        <li>{!! $note->note !!}</li>
                    @endforeach
                </ul>
            </div>
        </div>
    @endunless
    {!!  Form::open(['action' => ['Www\StudentController@destroy', $student->id], 'method' => 'delete','class'=>'inline']) !!}
    <button class="btn btn--alert btn--red-svg"
            data-toggle="tooltip" title="Supprimer l’élève : : {!! $student->fullname !!}">
        <svg class="svg-basic svg--white">
            <use xlink:href="#shape-trash"></use>
        </svg>
        <span>Supprimer l’élève : {!! $student->fullname !!}</span>
    </button>
@stop