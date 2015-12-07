<ul class="box">
<li class="box-header beta">{!! link_to_action('Www\CoursController@index','Mes cours d’aujourd’hui',[],['class'=>'link-spacer']) !!}
    <a href="{!! URL::action('Www\CoursController@create') !!}" class=""
       data-toggle="tooltip" title="Ajouter un cours">
        <svg class="svg-basic svg--blue">
            <use xlink:href="#shape-create"></use>
        </svg>
    </a>
    <a href="{!! URL::action('Www\UserController@getPlanificateFull') !!}" class=""
       data-toggle="tooltip" title="Planifier une séance de cours">
        <svg class="svg-basic svg--blue">
            <use xlink:href="#shape-calendar"></use>
        </svg>
    </a>
</li>
@if(empty(\Auth::user()->cours->toArray()))
    <li class="box__item"><span class="link-spacer">Vous n'avez pas encore de
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
        @else
            <li class="box__item">
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
            </li>
        @endif
    @endforeach
@endif
</ul>