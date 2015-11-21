<div class="layout">
    <div class="layout__item u-2/12 logo media">
        <svg class="svg-basic svg-main-logo media__img--svg media__img">
            <title>logo</title>
            <use xlink:href="#logo-white"></use>
        </svg>
        <div class="media__body">
            {!! Html::link('/','Présent',['class'=>'delta logo__item']) !!}
        </div>
    </div>
    <div class="layout__item u-7/12">
        @include('forms.search.search')
    </div>
    <div class="layout__item u-1/12">
        <div class="dropdown-menu-container dropdown-menu-container--hover">
            <a href="">
                <svg class="svg-basic">
                    <title>Notifications</title>
                    <use xlink:href="#notifications"></use>
                </svg>
                <svg class="svg-basic dropdown-menu__arraw">
                    <title>flèche vers le bas</title>
                    <use xlink:href="#down"></use>
                </svg>
            </a>

            <div class="dropdown-menu">
                <ul>
                    <li class="dropdown-menu__item">Une news</li>
                    <li class="dropdown-menu__item"><a href="">Encore une news</a></li>
                    <li class="dropdown-menu__item"><a href="">Encore une news</a></li>
                </ul>
            </div>
        </div>
    </div>
    <div class="layout__item u-2/12">
        <div class="media dropdown-menu-container dropdown-menu-container--hover">
            <img src="{!! asset('./img/default_profile_picture.jpg') !!}" alt=""
                 class="media__img user-image user-image--small">
            <a href="" class="media__body header-meta no-underline">
                <span class="header-meta__item">{!! $user->first_name !!}</span>
                <span class="header-meta__item">{!! $user->last_name !!}</span>
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
                        <a href="">
                            <svg class="svg-basic dropdown-menu__arraw">
                                <title>Configuration</title>
                                <use xlink:href="#compte"></use>
                            </svg>
                            {!! link_to_action('Www\UserController@getConfig', 'Mon compte', [], ['class'=>'']) !!}
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</div>