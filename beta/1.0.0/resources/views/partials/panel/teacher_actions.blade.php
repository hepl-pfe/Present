<div class="layout">
    <div class="layout__item u-4/12">
        {!! Form::open(['action'=>'Www\SearchController@mainSearch','method'=>'get','data-intro'=>'Faites toutes vos recherches ici','data-step'=>'2']) !!}
        @include('forms.search.search',['submit'=>'Rechercher !'])
        {!! Form::close() !!}
    </div>
    <div class="layout__item u-5/12">
        <h1 class="beta text-center">@yield('title')</h1>
    </div>
    <div class="layout__item u-3/12">
        <div class="media dropdown-menu-container dropdown-menu-container--hover"
             data-intro="Retrouver ici les informations relatives à votre compte" data-step="1">
            <img src="{!! asset('./img/default_profile_picture.jpg') !!}" alt=""
                 class="media__img user-image user-image--small">
            <a href="" class="media__body header-meta no-underline">
                <span class="header-meta__item">{!! $user->name !!}</span>
                <svg class="svg-basic dropdown-menu__arraw">
                    <title>flèche vers le bas</title>
                    <use xlink:href="#down"></use>
                </svg>
            </a>
            <div class="dropdown-menu">
                <ul>
                    <li class="dropdown-menu__item">
                        {!! Html::link('auth/logout','Se déconnecter') !!}
                    </li>
                    @if($user->schools->first())
                        @if(count($user->schools)>1)
                            <li class="dropdown-menu__item">
                                {!! Html::linkAction('Www\SchoolController@index','Mes écoles') !!}
                            </li>
                        @else
                            <li class="dropdown-menu__item">
                                {!! Html::linkAction('Www\SchoolController@index','Mon école') !!}
                            </li>
                        @endif
                    @endif
                    <li class="dropdown-menu__item">
                        <svg class="svg-basic dropdown-menu__arraw">
                            <title>Configuration</title>
                            <use xlink:href="#shape-compte"></use>
                        </svg>
                        <a href="{!! URL::action('Www\UserController@getConfig') !!}">Mon compte</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>