@extends('layouts.teacher_layout')
@section('title', 'Mes séances')
@section('teacher_content')
    @include('partials.panel.seances_actions')
    <?php $emtyClass = [];
    $before = '';
    $i = 0;
    $ii = 0;
    $even = 0?>
    @if($occurrences->count()>0)
        <ul class="time-line-container">
            @foreach($occurrences as $occurrence)
                @if(!empty($occurrence->classe->students->toArray()))
                    <?php $even++; ?>
                    @if($even%2!==0)
                        <li class="layout layout--center layout--huge ">
                            @endif
                            <div class="time-line__item layout__item u-4/12-desk u-6/12-lap u-12/12-palm ">
                                <div class="box time-line">
                                    <p><span class="visuallyhidden">Le cours se donnera </span>
                                        <time datetime="{!! $occurrence->from_hour->toW3cString() !!}">{!! $occurrence->from_hour->formatLocalized('%A %d %B %Y') !!}</time>
                                    </p>
                                    <h2 class="box-header epsilon box-header--many-content">
                                        <a href="{!! URL::action('Www\CoursController@show',['id'=>$occurrence->cour->slug]) !!}"
                                           class="block no-underline"
                                           title="Renvoie vers la classe {!! Auth::user()->cours->find($occurrence->cour_id)->name !!}">
                                            <svg class="svg-basic svg--blue svg--small">
                                                <use xlink:href="#shape-cours"></use>
                                            </svg>
                                            <span class="">Le cours de </span><i>{!! $occurrence->cour->name !!}</i>
                                        </a>
                                        <a href="{!! URL::action('Www\CoursController@show',['id'=>$occurrence->cour->slug]) !!}"
                                           class="block no-underline color-inerit"
                                           title="Renvoie vers la classe {!! Auth::user()->cours->find($occurrence->cour_id)->name !!}">
                                            <svg class="svg-basic svg--blue svg--small">
                                                <use xlink:href="#shape-classes"></use>
                                            </svg>
                                            <span class="">Avec la classe </span><i>{!! $occurrence->classe->name !!}</i>
                                        </a>
                                    </h2>
                                    @if($occurrence->is_closed==1)
                                        <?php $iTotalStudent = 0;
                                        $statusTable = [];
                                        ?>
                                        @foreach($occurrence->presents()->get() as $present)
                                            <?php ++$iTotalStudent; ?>
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
                                        <p>Sur {{ $iTotalStudent }} élèves il y a,
                                            <?php $i = 1; ?>
                                            @foreach($statusTable as $statut)
                                                {{$statut['nbr']}}
                                                <i>{{$statut['name']}}</i>{{ $i<count($statusTable)?',':'' }}
                                                <?php $i++;?>
                                            @endforeach.</p>
                                        <div id="piechart-{{$occurrence->id}}"
                                             <?php $ii = 0 ?>
                                             @foreach($statusTable as $statut)
                                             <?php $ii++; ?>
                                             data-present_{{$ii}}="{{$ii}},{{$statut['name']}},{{$statut['nbr']}},{{$statut['color']}}"
                                             @endforeach
                                             class="piechart-seances"></div>
                                    @endif
                                    <a href="{!!  URL::action($occurrence->is_closed==1?'Www\PresentController@editAllStudentfromOneOccurrence':'Www\PresentController@getAllStudentfromOneOccurrence',['id'=>$occurrence->id]) !!}"
                                       class="btn btn--blue-svg btn--small {{ $occurrence->is_closed==1?'btn--lighter':'' }}">
                                        <svg class="svg-basic svg--white svg--small">
                                            <use xlink:href="#shape-to-do"></use>
                                        </svg>
                                        <span>{{ $occurrence->is_closed==1?'reprendre les présences':'Prendre les présences' }}
                                            <time class="visuallyhidden"
                                                  datetime="{!! $occurrence->from_hour->toW3cString() !!}">du {!! $occurrence->from_hour->formatLocalized('%A %d %B %Y') !!}</time></span>
                                    </a>
                                </div>
                            </div>
                            @if($even%2==0)
                        </li>
                    @endif
                @else
                    @unless($before==$occurrence->classe->name)
                        <?php array_push($emtyClass, Html::linkAction('Www\ClassController@show', $occurrence->classe->name, [$occurrence->classe->slug])) ?>
                    @endunless
                    <?php $before = $occurrence->classe->name; ?>
                @endif
                <?php $i++; ?>
            @endforeach
        </ul>
    @include('pagination.default', ['paginator' => $occurrences])
    @else
        @include('errors.error_seances')
    @endif
    @unless(empty($emtyClass))
        <div class="layout">
            <p>
                Vous avez {!! $i !!} séances. Mais
                @if(count($emtyClass)>1)
                    les classes
                @else
                    la classe
                @endif
                @foreach($emtyClass as $message)
                    {!! $message !!}
                @endforeach
                @if(count($emtyClass)>1)
                    ne contiennent pas d’élèves.
                @else
                    ne contient pas d’élève.
                @endif
            </p>
        </div>
    @endunless
@stop