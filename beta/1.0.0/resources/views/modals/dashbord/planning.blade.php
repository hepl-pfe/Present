<section class="box">
    <h2 class="box-header beta">
        <span class="link-spacer">Mon planing</span>
        @if($isAllowToPlannificate)
            <a href="{!! URL::action('Www\PresentController@getPlanificateFull') !!}"
               data-toggle="tooltip" title="Planifier une séance de cours">
                <svg class="svg-basic svg--blue">
                    <use xlink:href="#shape-calendar"></use>
                </svg>
            </a>
        @endif
    </h2>
    @if(empty(\Auth::user()->cours->toArray()))
        <div class="box__item" data-intro="Créer un nouveau cours ici" data-step="4">
            @include('errors.error_seances')
        </div>
    @else
        @foreach($occurrences as $occurrence)
            <div class="box__item">
                <a href="{!!  URL::action($occurrence->is_closed==1?'Www\PresentController@editAllStudentfromOneOccurrence':'Www\PresentController@getAllStudentfromOneOccurrence',['id'=>$occurrence->id]) !!}">
                    <div class="box__item__body">
                        <time class="meta-time" data-toggle="tooltip"
                              data-title="{!! $occurrence->from->formatLocalized('%a, %e %B %Y') !!} à {{$occurrence->from_hour->formatLocalized('%H:%M')}}">{{$occurrence->from_hour->formatLocalized('%H:%M ')}}{!! $occurrence->from->formatLocalized('%d/%m') !!}</time>
                        <span>{{$occurrence->cour->name}}</span>
                    </div>
                    <div class="box__item__actions">
                        @if($occurrence->is_closed=='0')
                            <a href="{!! URL::action('Www\PresentController@getAllStudentfromOneOccurrence',['id'=>$occurrence->id]) !!}"
                               data-toggle="tooltip" title="Prendre les présences" class="svg-container">
                                <svg class="svg-basic svg--blue">
                                    <use xlink:href="#shape-to-do"></use>
                                </svg>
                                <span class="visuallyhidden">Prendre les présences</span>
                            </a>
                        @else
                            <div data-toggle="tooltip" data-title="Reprendre les présences du {!! $occurrence->from->formatLocalized('%a, %e %b %Y') !!} à {{$occurrence->from_hour->formatLocalized('%H:%M')}}" class="svg-container">
                                <svg class="svg-basic svg--success svg--small">
                                    <use xlink:href="#shape-checked"></use>
                                </svg>
                            </div>
                        @endif
                    </div>
                </a>
            </div>
        @endforeach
        <div>
            @include('pagination.default', ['paginator' => $occurrences])
        </div>
    @endif
</section>