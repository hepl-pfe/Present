<ul class="box">
    <li class="box-header beta">
        {!! Html::linkAction('Www\CoursController@index','Mes cours',[],['class'=>'link-spacer']) !!}
        <a href="{!! URL::action('Www\CoursController@create') !!}" class=""
           data-toggle="tooltip" title="Créer un cours" data-form="create-cours-form">
            <svg class="svg-basic svg--blue">
                <use xlink:href="#shape-create"></use>
            </svg>
        </a>
        <a href="{!! URL::action('Www\PresentController@getPlanificateFull') !!}" class=""
           data-toggle="tooltip" title="Planifier une séance de cours" data-form="create-planing-form--cours">
            <svg class="svg-basic svg--blue">
                <use xlink:href="#shape-calendar"></use>
            </svg>
        </a>
    </li>
    @if(empty(\Auth::user()->cours->toArray()))
        <li class="box__item" data-intro="Créer un nouveau cours ici" data-step="4"><span class="link-spacer">Vous n'avez pas encore de
        cours</span> {!! link_to_action('Www\CoursController@create','Créer un cours !',[],['class'=>'']) !!}</li>
    @else
        @foreach(Auth::user()->cours as $cour)
            @if($cour->hasOccurrence)
                @foreach(Auth::user()->occurrences()->today()->get() as $occurrence)
                    <li class="box__item">
                        <span class="meta-time">{!! $occurrence->from_hour->toTimeString() !!}</span>
                        {!! Html::linkAction('Www\CoursController@show',$cour->name,['slug'=>$cour->slug],['class'=>'link--black link-spacer']) !!}
                        {!! Form::open(['action' => ['Www\CoursController@destroy', $cour->id], 'method' => 'delete','class'=>'inline']) !!}
                        <button class="link--alert" class=""
                                data-toggle="tooltip" title="Supprimer le cours : {!! $cour->name !!}">
                            <svg class="svg-basic svg--alert">
                                <use xlink:href="#shape-trash"></use>
                            </svg>
                            <span class="visuallyhidden">Supprimer le cours {!! $cour->name !!}</span>
                        </button>
                        {!! Form::close() !!}
                        <a href="{!! URL::action('Www\CoursController@edit',['slug'=>$cour->slug]) !!}" class=""
                           data-toggle="tooltip" title="Modifier le cours : {!! $cour->name !!}">
                            <svg class="svg-basic svg--blue">
                                <use xlink:href="#shape-edit"></use>
                            </svg>
                            <span class="visuallyhidden">Modifier le cours {!! $cour->name !!}</span>
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
                    </li>
                @endforeach
            @endif
        @endforeach
    @endif
    <div class="form-hidde create-cours-form">
        {!! Form::open(['action' => 'Www\ClassController@store','enctype'=>'multipart/form-data','class'=>'']) !!}
        <a href="#" data-form="create-cours-form">fermer la fenetre</a>
        @include('forms.class.create')
        {!! Form::close() !!}
    </div>
    <div class="form-hidde create-planing-form--cours">
        {!! Form::open(['action' => 'Www\PresentController@storePlanificateFull']) !!}
        <a href="#" data-form="create-planing-form--cours">fermer la fenetre</a>
        @include('forms.seances.create_full_seance',['submit'=>'Planifier des séances de cours'])
        {!! Form::close() !!}
    </div>
</ul>