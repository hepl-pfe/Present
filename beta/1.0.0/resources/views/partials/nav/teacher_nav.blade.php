<div role="navigation" class="layout__item main-nav">
    <ul class="list-block">
        <li class="list-block__item main-nav__item {{ Request::is( '/') ? 'main-nav__item--active' : '' }}">
            <a href="{!! URL::to('/') !!}" class="media no-underline">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#shape-home"></use>
                </svg>
                <span class="media-body navbar-item">Accueil</span>
            </a>
        </li>
        <li class="list-block__item main-nav__item jshjkshkshshk {{ Request::is( 'cours') ? 'main-nav__item--active' : '' }}" data-intro="Retrouvez tous vos cours ici" data-step="6">
            <a href="{!! URL::to('/cours') !!}" class="media no-underline">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#shape-cours"></use>
                </svg>
                <span class="media-body navbar-item">Mes cours</span>
            </a>
        </li>
        <li class="list-block__item main-nav__item {{ Request::is( 'student') ? 'main-nav__item--active' : '' }}">
            <a href="{!! URL::action('Www\StudentController@index') !!}" class="media no-underline">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#shape-students"></use>
                </svg>
                <span class="media-body navbar-item">Mes élèves</span>
            </a>
        </li>
        <li class="list-block__item main-nav__item {{ Request::is( 'classe') ? 'main-nav__item--active' : '' }}">
            <a href="{!! URL::action('Www\ClassController@index') !!}" class="media no-underline">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#shape-classes"></use>
                </svg>
                <span class="media-body navbar-item">Mes classes</span>
            </a>
        </li>
        <li class="list-block__item main-nav__item {{ Request::is( 'colleagues') ? 'main-nav__item--active' : '' }}">
            <a href="{!! URL::action('Www\UserController@index') !!}" class="media no-underline">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#shape-collegues"></use>
                </svg>
                <span class="media-body navbar-item">Collègues</span>
            </a>
        </li>
        <li class="list-block__item main-nav__item {{ Request::is( 'room') ? 'main-nav__item--active' : '' }}">
            <a href="{!! URL::action('Www\RoomController@index') !!}" class="media no-underline">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#shape-columns"></use>
                </svg>
                <span class="media-body navbar-item">Locaux</span>
            </a>
        </li>
        <li class="list-block__item main-nav__item {{ Request::is( 'school/config') ? 'main-nav__item--active' : '' }}">
            <a href="{!! URL::action('Www\SchoolController@getConfig') !!}" class="media no-underline">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#shape-compte"></use>
                </svg>
                <span class="media-body navbar-item">Configuration</span>
            </a>
        </li>
    </ul>
</div>