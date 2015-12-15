<ul class="box">
    <li class="box-header beta">{!! Html::linkAction('Www\ClassController@index','Les classes',[],['class'=>'link-spacer']) !!}
        <a href="{!! URL::action('Www\ClassController@create') !!}" class=""
           data-toggle="tooltip" title="Créer une classe">
            <svg class="svg-basic svg--blue">
                <use xlink:href="#shape-create"></use>
            </svg>
        </a>
    </li>
    @if(empty(\Auth::user()->classes->toArray()))
        <li class="box__item"><span class="link-spacer" data-intro="Créer une nouvelle classe ici" data-step="3">Vous n'avez pas encoore de
            classe ?</span>
            {!! link_to_action('Www\ClassController@create','Créer une classe !',[],['class'=>'']) !!}</li>
    @else
        @foreach(\Auth::user()->classes as $classe)
            <li class="box__item">{!! Html::linkAction('Www\ClassController@show',$classe->name,['slug'=>$classe->name],['title'=>'Afiiche la classe','class'=>'link-spacere']) !!}
                {!!  Form::open(['action' => ['Www\ClassController@destroy', $classe->id], 'method' => 'delete','class'=>'inline']) !!}
                <button class="link--alert" class=""
                        data-toggle="tooltip" title="Supprimer la classe : {!! $classe->name !!}">
                    <svg class="svg-basic svg--alert">
                        <use xlink:href="#shape-trash"></use>
                    </svg>
                    <span class="visuallyhidden">Supprimer la classe {!! $classe->name !!}</span>
                </button>
                {!! Form::close() !!}
                <a href="{!! URL::action('Www\ClassController@edit',['slug'=>$classe->slug]) !!}" class=""
                   data-toggle="tooltip" title="Modifier la classe : {!! $classe->name !!}">
                    <svg class="svg-basic svg--blue">
                        <use xlink:href="#shape-edit"></use>
                    </svg>
                    <span class="visuallyhidden">Modifier la classe {!! $classe->name !!}</span>
                </a>
                <a href="{!! URL::action('Www\ClassController@getAddStudentToClass',['slug'=>$classe->slug]) !!}" class=""
                   data-toggle="tooltip" title="Ajouter des élèves à la classe : {!! $classe->name !!}">
                    <svg class="svg-basic svg--blue">
                        <use xlink:href="#shape-link"></use>
                    </svg>
                    <span class="visuallyhidden">Lier des élèves à la classe {!! $classe->name !!}</span>
                </a>
            </li>
        @endforeach
    @endif
</ul>