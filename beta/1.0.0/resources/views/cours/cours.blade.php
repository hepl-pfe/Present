@extends('layouts.teacher_layout')
@section('title','Cours '. $cour->name)
@section('teacher_content')
    <div class="layout">
        @if($cour->classes()->count()>0)
            <p class="header-page gamma layout__item u-12/12-desk u-12/12-lap u-12/12-palm">Aperçu
                de{{ $cour->classes()->count()>1?'s':'' }} {{ $cour->classes()->count()>1?'':'la' }}
                classe{{ $cour->classes()->count()>1?'s':'' }} qui {{ $cour->classes()->count()>1?'suivent':'suit' }} le
                cours <i>{{ $cour->name }}</i></p>
            @foreach($classesPagination as $classe)
                <div class="layout__item u-4/12-desk u-6/12-lap u-12/12-palm">
                    @include('modals.classes.one-classe',['isClasse'=>true])
                </div>
            @endforeach
            @include('pagination.default', ['paginator' => $classesPagination])
            @if(!empty($cour->occurrences->toArray()))
                @if($cour->occurrences()->whereIsClosed(1)->count())
                    <div class="layout__item u-12/12-desk u-12/12-lap u-12/12-palm">
                        <div class="nav-tab-container">
                            <nav class="nav-tabs">
                                <h2 class="visuallyhidden">Navigation des différents graphiques</h2>
                                <a class="prevent-default nav-tabs__item nav-tabs__item--active" href="#tabs-1">Répartition
                                    des
                                    statuts de
                                    présences.</a><!----><a class="prevent-default nav-tabs__item" href="#tabs-3">Répartition
                                    des
                                    présences en fonction des classes.</a>
                            </nav>
                            <div class="tab-container">
                                <?php $classeAndSatutTabble = []; ?>
                                <?php $iTotalSeances = 0;
                                $statusTable = [];
                                ?>
                                @foreach($cour->classes as $classe)
                                    @foreach($classe->students as $student)
                                        @foreach($student->presences as $present)
                                            @if($present->occurrence->cour->id== $cour->id)
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
                                                if (array_key_exists($present->occurrence->classe->id, $classeAndSatutTabble)) {
                                                    $classeAndSatutTabble[ $present->occurrence->classe->id ]['TotalPresent'] += 1;
                                                    if (array_key_exists($present->statut->id, $classeAndSatutTabble[ $present->occurrence->classe->id ]['statuts'])) {
                                                        // incrémente les statuts existants
                                                        $classeAndSatutTabble[ $present->occurrence->classe->id ]['statuts'][ $present->statut->id ]['nbr'] += 1;
                                                    } else {
                                                        $classeAndSatutTabble[ $present->occurrence->classe->id ]['statuts'][ $present->statut->id ] = ['name' => $present->statut->name, 'colors' => $present->statut->color, 'nbr' => 1];
                                                        // Crée les deux autres statuts
                                                    }
                                                } else {
                                                    $classeAndSatutTabble[ $present->occurrence->classe->id ]['TotalPresent'] = 1;
                                                    $classeAndSatutTabble[ $present->occurrence->classe->id ]['name'] = $present->occurrence->classe->name;
                                                    $classeAndSatutTabble[ $present->occurrence->classe->id ]['statuts'][ $present->statut->id ] = ['name' => $present->statut->name, 'colors' => $present->statut->color, 'nbr' => 1];
                                                }
                                                ?>
                                            @endif
                                        @endforeach
                                    @endforeach
                                @endforeach
                                <div class="one-tab-container one-tab-container--active" id="tabs-1">
                                    <div id="piechart-{{$cour->id}}"
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
                            $classeAndSatutTabble['meta']['statuts'][] = ['id' => $statut->id, 'name' => $statut->name, 'color' => $statut->color];
                        }
                        $classeAndSatutTabble['meta']['max-statut'] = $statutI;
                        ?>
                        <div class="one-tab-container" id="tabs-3">
                            <div id="bar-chart-2-{{$cour->id}}"
                                 data-graph="{{ htmlspecialchars(json_encode($classeAndSatutTabble), ENT_QUOTES, 'UTF-8') }}"
                                 class="bar-chart-statuts-cours graphique-container"></div>
                        </div>
                    </div>
                @else
                    <div class="box-container layout__item u-12/12-desk u-12/12-lap u-12/12-palm">
                        {!! Html::linkAction('Www\PresentController@index','Voir la liste des séances',[],['class'=>'btn btn--small']) !!}
                        @include('forms.partials.base-info--important',['message'=>'Vous n’avez pas encore pris des présences avec ce cours.'])
                    </div>
    </div>
    @endif
    @else
        <div class="box-container layout__item u-6/12-desk u-12/12-lap u-12/12-palm">
            @if($cour->occurrences()->count()==0)
                {!! Html::linkAction('Www\PresentController@getPlanificateFullWithCours','Planifier une séance de cours avec le cours '.$cour->name,[$cour->slug],['class'=>'btn btn--small']) !!}
                @include('forms.partials.base-info--important',['message'=>'Vous n’avez pas encore <a href="'.URL::action('Www\PresentController@storePlanificateFull').'">planifié de séances</a> avec ce cours.'])
            @endif
        </div>
    @endif
    @else
        <div class="box-container layout__item u-12/12-desk u-12/12-lap u-12/12-palm">
            {!! Html::linkAction('Www\CoursController@create','Créer un cours',[],['class'=>'btn btn--small','title'=>'Renvoie vers la page qui permet de créer un cours']) !!}
            @if($user->classes()->count()>0)
                {!! Html::linkAction('Www\PresentController@getPlanificateFull','Planifier des séances',[],['class'=>'btn btn--small','title'=>'Renvoie vers la page qui permet de planifier un cours.']) !!}
            @endif
            @include('forms.partials.base-info--important',['message'=>'Ce cours n’est donné à aucune classe.'])
        </div>
    @endif
@stop