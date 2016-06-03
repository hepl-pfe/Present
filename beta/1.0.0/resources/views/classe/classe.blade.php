@extends('layouts.teacher_layout')
@section('title','La classe : '.$classe->name)
@section('teacher_content')
    <div class="layout">
        @if(!empty($classe->occurrences->toArray()))
            <div class="layout__item u-8/12-desk u-12/12-lap u-12/12-palm">
                @if($classe->students()->count()>1)
                    Les classes {{ $classe->name }} est composé de :
                    <ul>
                        @foreach($classe->students as $student)
                            <li>
                                {!! Html::linkAction('Www\StudentController@show',$student->fullname,[$student->slug],['title'=>'Renvoie vers la page de l’élève '.$student->fullname]) !!}
                            </li>
                        @endforeach
                    </ul>
                    <?php $coursAndSatutTabble = []; ?>
                    <?php $iTotalSeances = 0;
                    $statusTable = [];
                    ?>
                    <div class="nav-tab-container">
                        <nav class="nav-tabs">
                            <h2 class="visuallyhidden">Navigation des différents graphiques</h2>
                            <a class="prevent-default nav-tabs__item nav-tabs__item--active" href="#tabs-1">Répartition
                                des
                                statuts de
                                présences.</a><!----><a class="prevent-default nav-tabs__item" href="#tabs-3">Répartition
                                des
                                présences en fonction des cours.</a>
                        </nav>
                        <div class="tab-container">
                            @foreach($classe->students as $student)
                                @foreach($student->presences as $present)
                                    @if($present->occurrence->classe->id== $classe->id)
                                        {{--ce sont toutes les présences de l'élèves or moi il me faut les présence uniquement de ce cours--}}
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
                                    @endif
                                @endforeach
                            @endforeach
                            <div class="one-tab-container one-tab-container--active" id="tabs-1">
                                <div id="piechart-{{$classe->id}}"
                                     <?php $ii = 0 ?>
                                     @foreach($statusTable as $statut)
                                     <?php $ii++; ?>
                                     data-present_{{$ii}}="{{$ii}},{{$statut['name']}},{{$statut['nbr']}},{{$statut['color']}}"
                                     @endforeach
                                     class="piechart-seances graphique-container">
                                </div>
                            </div>
                        </div>
                    </div>
                    <?php
                    $statutI = 0;
                    foreach (\Auth::user()->statuts as $statut) {
                        ++$statutI;
                        $coursAndSatutTabble['meta']['statuts'][] = ['id' => $statut->id, 'name' => $statut->name, 'color' => $statut->color];
                    }
                    $coursAndSatutTabble['meta']['max-statut'] = $statutI;
                    ?>
                    <div class="one-tab-container" id="tabs-3">
                        <div id="bar-chart-2-{{$classe->id}}"
                             data-graph="{{ htmlspecialchars(json_encode($coursAndSatutTabble), ENT_QUOTES, 'UTF-8') }}"
                             class="bar-chart-statuts-cours graphique-container"></div>
                    </div>
            </div>

        @else
            L’élève {{ $classe->student->first()->fullname }} fait partie de la classe.
        @endif
        @else
            <div class="box-container layout__item u-6/12-desk u-12/12-lap u-12/12-palm">
                @if($classe->occurrences()->count()==0)
                    {!! Html::linkAction('Www\PresentController@getPlanificateFullWithCours','Plafiner une séance de cours avec la classe '.$classe->name,[$classe->slug],['class'=>'btn']) !!}
                    @include('forms.partials.base-info--important',['message'=>'Vous n’avez pas encore <a href="'.URL::action('Www\PresentController@storePlanificateFull').'">planifié de séances</a> avec ce cours.'])
                @endif
            </div>
        @endif
    </div>
@stop