<ul class="box">
    <li class="box-header beta">{!! Html::linkAction('Www\ClassController@index','Les classes',[],['class'=>'link-spacer']) !!}
        <a href="{!! URL::action('Www\ClassController@create') !!}" class=""
           data-toggle="tooltip" title="Créer une classe" data-form="create-classe-form">
            <svg class="svg-basic svg--blue">
                <use xlink:href="#shape-create"></use>
            </svg>
        </a>
    </li>
    @if($classes->total()==0)
        <li class="box__item"><span class="link-spacer" data-intro="Créer une nouvelle classe ici" data-step="3">Vous n'avez pas encoore de
            classe ?</span>
            {!! link_to_action('Www\ClassController@create','Créer une classe !',[],['class'=>'','data-form'=>'create-classe-form']) !!}
        </li>
    @else
        <li>
            {!! Form::open(['action'=>'Www\SearchController@mainSearch','method'=>'get','class'=>'box__search--small']) !!}
                @include('forms.search.classe.search')
            {!! Form::close() !!}
        </li>
        @foreach($classes as $classe)
            <li class="box__item">{!! Html::linkAction('Www\ClassController@show',$classe->name,['slug'=>$classe->name],['title'=>'Afiiche la classe','class'=>'link-spacere']) !!}
                <div class="form-hidde delete-class-form--{!! $classe->slug !!}">
                    {!!  Form::open(['action' => ['Www\ClassController@destroy', $classe->id], 'method' => 'delete','class'=>'']) !!}
                    <a href="#" data-form="delete-class-form--{!! $classe->slug !!}" class="hide-modal--top">
                        <svg class="hide-modal--top__svg svg--alert">
                            <use xlink:href="#shape-close-modal"></use>
                        </svg>
                        <span class="visuallyhidden">fermer la fenêtre</span>
                    </a>
                    <p>Vous êtes sur le point de supprimer la classe : {!! $classe->name !!}</p>
                    <div class="text--center btn-container">
                        <button class=" btn btn--small btn--red-svg btn--alert"
                                title="Supprimer la classe : {!! $classe->name !!}">
                            <svg class="svg-basic svg--white">
                                <use xlink:href="#shape-trash"></use>
                            </svg>
                            <span class="">Supprimer la classe {!! $classe->name !!}</span>
                        </button>
                    </div>
                    <a href="#" data-form="delete-class-form--{!! $classe->slug !!}">fermer la fenêtre</a>
                    {!! Form::close() !!}
                </div>
                {!!  Form::open(['action' => ['Www\ClassController@destroy', $classe->id], 'method' => 'delete','class'=>'inline']) !!}
                <button class="link--alert" class=""
                        data-toggle="tooltip" data-form="delete-class-form--{!! $classe->slug !!}"
                        title="Supprimer la classe : {!! $classe->name !!}">
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
                <a href="{!! URL::action('Www\ClassController@getAddStudentToClass',['slug'=>$classe->slug]) !!}"
                   class=""
                   data-toggle="tooltip" title="Ajouter des élèves à la classe : {!! $classe->name !!}">
                    <svg class="svg-basic svg--blue">
                        <use xlink:href="#shape-link"></use>
                    </svg>
                    <span class="visuallyhidden">Lier des élèves à la classe {!! $classe->name !!}</span>
                </a>
            </li>
        @endforeach
        {!! $classes->render() !!}
    @endif
    <div class="form-hidde create-classe-form">
        {!! Form::open(['action' => 'Www\ClassController@store','enctype'=>'multipart/form-data','class'=>'']) !!}
        <a href="#" data-form="create-classe-form" class="hide-modal--top">
            <svg class="hide-modal--top__svg svg--alert">
                <use xlink:href="#shape-close-modal"></use>
            </svg>
            <span class="visuallyhidden">fermer la fenêtre</span>
        </a>
        @include('forms.class.create',['submit'=>'Créer la classe'])
        <a href="#" data-form="create-classe-form">fermer la fenêtre</a>
        {!! Form::close() !!}
    </div>
</ul>