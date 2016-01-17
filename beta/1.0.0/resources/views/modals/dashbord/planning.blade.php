<ul class="box">
    <li class="box-header beta">
        <span class="link-spacer">Mon planing</span>
        @if($isAllowToPlannificate)
            <a href="{!! URL::action('Www\PresentController@getPlanificateFull') !!}" class=""
               data-toggle="tooltip" title="Planifier une séance de cours" data-form="create-planing-form">
                <svg class="svg-basic svg--blue">
                    <use xlink:href="#shape-calendar"></use>
                </svg>
            </a>
        @endif
    </li>
    @if(empty(\Auth::user()->cours->toArray()))
        <li class="box__item" data-intro="Créer un nouveau cours ici" data-step="4"><span class="link-spacer">Vous n'avez pas encore de
        cours</span> {!! link_to_action('Www\CoursController@create','Créer un cours !',[],['class'=>'','data-form'=>'create-cours-form']) !!}
        </li>
    @else
        @foreach($occurrences as $occurrence)
            <li class="box__item">
                <div class="box__item__body">
                    <span class="meta-time">{!! $occurrence->from_hour->toTimeString() !!}</span>
                    {!! Html::linkAction('Www\CoursController@show',$occurrence->cour->name,['slug'=>$occurrence->cour->slug],['class'=>'link--black link-spacer']) !!}
                </div>
                <div class="box__item__actions" >
                    {!! Form::open(['action' => ['Www\CoursController@destroy', $occurrence->cour->id], 'method' => 'delete','class'=>'inline']) !!}
                    <button class="link--alert" class=""
                            data-toggle="tooltip" title="Supprimer le cours : {!! $occurrence->cour->name !!}">
                        <svg class="svg-basic svg--alert">
                            <use xlink:href="#shape-trash"></use>
                        </svg>
                        <span class="visuallyhidden">Supprimer le cours {!! $occurrence->cour->name !!}</span>
                    </button>
                    {!! Form::close() !!}
                    <a href="{!! URL::action('Www\CoursController@edit',['slug'=>$occurrence->cour->slug]) !!}" class=""
                       data-toggle="tooltip" title="Modifier le cours : {!! $occurrence->cour->name !!}">
                        <svg class="svg-basic svg--blue">
                            <use xlink:href="#shape-edit"></use>
                        </svg>
                        <span class="visuallyhidden">Modifier le cours {!! $occurrence->cour->name !!}</span>
                    </a>
                    @if($occurrence->is_closed=='0')
                        <a href="{!! URL::action('Www\PresentController@getAllStudentfromOneOccurrence',['id'=>$occurrence->id]) !!}"
                           class=""
                           data-toggle="tooltip" title="Prendre les présences">
                            <svg class="svg-basic svg--blue">
                                <use xlink:href="#shape-to-do"></use>
                            </svg>
                            <span class="visuallyhidden">Prendre les présences</span>
                        </a>
                    @else
                        <svg class="svg-basic svg--success">
                            <use xlink:href="#shape-checked"></use>
                        </svg>
                    @endif
                </div>

            </li>
        @endforeach
        {!! $occurrences->render() !!}
    @endif
    <div class="form-hidde create-planing-form">
        {!! Form::open(['action' => 'Www\PresentController@storePlanificateFull']) !!}
        <a href="#" data-form="create-planing-form" class="hide-modal--top">
            <svg class="hide-modal--top__svg svg--alert">
                <use xlink:href="#shape-close-modal"></use>
            </svg>
            <span class="visuallyhidden">fermer la fenêtre</span>
        </a>
        @include('forms.seances.create_full_seance',['submit'=>'Planifier des séances de cours'])
        <a href="#" data-form="create-planing-form" class="">fermer la fenêtre</a>
        {!! Form::close() !!}
    </div>
</ul>