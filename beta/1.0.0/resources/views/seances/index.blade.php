@extends('layouts.teacher_layout')
@section('title', 'Mes séances')
@section('teacher_content')
    @include('partials.panel.index_actions')
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
                        <li class="layout layout--center {{ ($even==$occurrences->count())&&($occurrences->count()%2!==0)?'time-line--impair':'' }}">
                            @endif
                                @include('modals.seances.one-seance')
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