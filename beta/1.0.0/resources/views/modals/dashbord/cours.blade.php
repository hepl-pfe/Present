<ul class="box">
    <li class="box-header beta">
        {!! Html::linkAction('Www\CoursController@index','Mes cours',[],['class'=>'link-spacer']) !!}
        <a href="{!! URL::action('Www\CoursController@create') !!}" class="svg-container"
           data-toggle="tooltip" title="Créer un cours" data-form="create-cours-form">
            <svg class="svg-basic svg--blue">
                <use xlink:href="#shape-create"></use>
            </svg>
        </a>
        <a href="{!! URL::action('Www\PresentController@getPlanificateFull') !!}" class="svg-container"
           data-toggle="tooltip" title="Planifier une séance de cours">
            <svg class="svg-basic svg--blue">
                <use xlink:href="#shape-calendar"></use>
            </svg>
        </a>
    </li>
    @if($cours->total()==0)
        <li class="box__item" data-intro="Créer un nouveau cours ici" data-step="4"><span class="link-spacer">Vous n'avez pas encore de
            cours</span> {!! link_to_action('Www\CoursController@create','Créer un cours !',[],['class'=>'','data-form'=>'create-cours-form']) !!}
        </li>
    @else
        <li>
            {!! Form::open(['action'=>'Www\SearchController@mainSearch','method'=>'get','class'=>'box__search--small']) !!}
            @include('forms.search.cours.search')
            {!! Form::close() !!}
        </li>
        @foreach($cours as $cour)
            <li class="box__item">
                <div class="box__item__body">
                    {!! Html::linkAction('Www\CoursController@show',$cour->name,['slug'=>$cour->slug],['class'=>'']) !!}
                </div>
                <div class="box__item__actions">
                    <div class="box__item__actions">
                        <div class="form-hidde delete-cours-form--{!! $cour->slug !!}">
                            {!!  Form::open(['action' => ['Www\CoursController@destroy', $cour->id], 'method' => 'delete','class'=>'']) !!}
                            <a href="#" data-form="delete-cours-form--{!! $cour->slug !!}" class="hide-modal--top">
                                <svg class="hide-modal--top__svg svg--alert">
                                    <use xlink:href="#shape-close-modal"></use>
                                </svg>
                                <span class="visuallyhidden">fermer la fenêtre</span>
                            </a>
                            <p>Vous êtes sur le point de supprimer le cours : {!! $cour->name !!}</p>
                            <div class="text--center btn-container">
                                <button class=" btn btn--small btn--red-svg btn--alert"
                                        title="Supprimer le cours : {!! $cour->name !!}">
                                    <svg class="svg-basic svg--white">
                                        <use xlink:href="#shape-trash"></use>
                                    </svg>
                                    <span>Supprimer le cours {!! $cour->name !!}</span>
                                </button>
                            </div>
                            <a href="#" data-form="delete-cours-form--{!! $cour->slug !!}">fermer la fenêtre</a>
                            {!! Form::close() !!}
                        </div>
                        {!!  Form::open(['action' => ['Www\CoursController@destroy', $cour->id], 'method' => 'delete','class'=>'inline']) !!}
                        <button class="link--alert"
                                data-toggle="tooltip" data-form="delete-cours-form--{!! $cour->slug !!}"
                                title="Supprimer le cours : {!! $cour->name !!}">
                            <svg class="svg-basic svg--alert">
                                <use xlink:href="#shape-trash"></use>
                            </svg>
                            <span class="visuallyhidden">Supprimer le cours {!! $cour->name !!}</span>
                        </button>
                        {!! Form::close() !!}
                        <a href="{!! URL::action('Www\CoursController@edit',['slug'=>$cour->slug]) !!}"
                           data-toggle="tooltip" title="Modifier le cours : {!! $cour->name !!}"
                           data-form="edit-cours-form--{!! $cour->slug !!}">
                            <svg class="svg-basic svg--blue">
                                <use xlink:href="#shape-edit"></use>
                            </svg>
                            <span class="visuallyhidden">Modifier le cours {!! $cour->name !!}</span>
                        </a>
                        <div class="form-hidde edit-cours-form--{!! $cour->slug !!}">
                            {!! Form::model($cour,['action' => ['Www\CoursController@update',$cour->id],'method'=>'patch']) !!}
                            <a href="#" data-form="edit-cours-form--{!! $cour->slug !!}" class="hide-modal--top">
                                <svg class="hide-modal--top__svg svg--alert">
                                    <use xlink:href="#shape-close-modal"></use>
                                </svg>
                                <span class="visuallyhidden">fermer la fenêtre</span>
                            </a>
                            @include('forms.cours.edit',['submit'=>'Modifier le cours de '.$cour->name])
                            <a href="#" data-form="edit-cours-form--{!! $cour->slug !!}">fermer la fenêtre</a>
                            {!! Form::close() !!}
                        </div>
                    </div>
                </div>
            </li>
        @endforeach
        <li>
            {!! $cours->render() !!}
        </li>
    @endif
    <li class="form-hidde create-cours-form">
        {!! Form::open(['action' => 'Www\CoursController@store','enctype'=>'multipart/form-data','class'=>'']) !!}
        <a href="#" data-form="create-cours-form" class="hide-modal--top">
            <svg class="hide-modal--top__svg svg--alert">
                <use xlink:href="#shape-close-modal"></use>
            </svg>
            <span class="visuallyhidden">fermer la fenêtre</span>
        </a>
        @include('forms.cours.create',['submit'=>'Créer le cours'])
        <a href="#" data-form="create-cours-form">fermer la fenêtre</a>
        {!! Form::close() !!}
    </li>
</ul>