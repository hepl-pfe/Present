@extends('layouts.teacher_layout')
@section('title','La classe : '.$classe->name)
@section('teacher_content')
    <div class="layout">
        @if(!empty($classe->occurrences->toArray()))
            @if($classe->students()->count()>0)
                @foreach($studentsPagination as $student)
                    <div class="layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
                        @include('modals.students.one-student',['isClasse'=>true])
                    </div>
                @endforeach
                @include('pagination.default', ['paginator' => $studentsPagination])
                @if($classe->occurrences()->whereIsClosed(1)->count())
                    <div class="layout__item u-12/12-desk u-12/12-lap u-12/12-palm">
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
                    <div class="box-container layout__item u-12/12-desk u-12/12-lap u-12/12-palm">
                        {!! Html::linkAction('Www\PresentController@index','Voir la liste des séances',[],['class'=>'btn']) !!}
                        @include('forms.partials.base-info--important',['message'=>'Vous n’avez pas encore pris de présences avec cette classe.'])
                    </div>
    </div>
    @endif
    @else
        <div class="box-container layout__item u-12/12-desk u-12/12-lap u-12/12-palm">
            {!! Html::linkAction('Www\StudentController@create','Créer un élève',[],['class'=>'btn','title'=>'Renvoie vers la page qui permet de créer un élève']) !!}
            @include('forms.partials.base-info--important',['message'=>'Cette classe ne comporte pas encore d’élève.'])
        </div>
    @endif
    @else
        <div class="box-container layout__item u-6/12-desk u-12/12-lap u-12/12-palm">
            @if($classe->occurrences()->count()==0)
                {!! Html::linkAction('Www\PresentController@getPlanificateFullWithCours','Plafiner une séance de cours avec la classe '.$classe->name,[$classe->slug],['class'=>'btn']) !!}
                @include('forms.partials.base-info--important',['message'=>'Vous n’avez pas encore <a href="'.URL::action('Www\PresentController@storePlanificateFull').'">planifié de séances</a> avec ce cours.'])
            @endif
        </div>
    @endif
@stop