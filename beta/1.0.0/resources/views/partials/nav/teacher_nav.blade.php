<div role="navigation" class="layout__item main-nav">
    <ul class="list-block">
        <li class="list-block__item main-nav__item main-nav__item--logo">
            <a href="{!! URL::to('/') !!}" class="media no-underline">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#shape-logo"></use>
                </svg>
                <span class="media-body navbar-item">Présent</span>
            </a>
        </li>
        <li class="list-block__item main-nav__item {!! $nav !!} {{ $nav=='dashboard' ? 'main-nav__item--active' : '' }}">
            <a href="{!! URL::to('/') !!}" class="media no-underline">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#shape-home"></use>
                </svg>
                <span class="media-body navbar-item">Accueil</span>
            </a>
        </li>
        <li class="list-block__item main-nav__item {{ $nav=="cours" ? 'main-nav__item--active' : '' }}" data-intro="Retrouvez tous vos cours ici" data-step="6">
            <a href="{!! URL::to('/cours') !!}" class="media no-underline">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#shape-cours"></use>
                </svg>
                <span class="media-body navbar-item">Mes cours</span>
            </a>
        </li>
        <li class="list-block__item main-nav__item {{ $nav=='students' ? 'main-nav__item--active' : '' }}">
            <a href="{!! URL::action('Www\StudentController@index') !!}" class="media no-underline">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#shape-students"></use>
                </svg>
                <span class="media-body navbar-item">Mes élèves</span>
            </a>
        </li>
        <li class="list-block__item main-nav__item {{ $nav=='classes' ? 'main-nav__item--active' : '' }}">
            <a href="{!! URL::action('Www\ClassController@index') !!}" class="media no-underline">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#shape-classes"></use>
                </svg>
                <span class="media-body navbar-item">Mes classes</span>
            </a>
        </li>
        <li class="list-block__item main-nav__item {{ $nav=='seances' ? 'main-nav__item--active' : '' }}">
            <a href="{!! URL::action('Www\PresentController@index') !!}" class="media no-underline">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#shape-calendar"></use>
                </svg>
                <span class="media-body navbar-item">Séances</span>
            </a>
        </li>
        <li class="list-block__item main-nav__item {{ $nav=='schools' ? 'main-nav__item--active' : '' }}">
            <a href="{!! URL::action('Www\SchoolController@index') !!}" class="media no-underline">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#shape-school"></use>
                </svg>
                <span class="media-body navbar-item">Mes écoles</span>
            </a>
        </li>
        <li class="list-block__item main-nav__item {{ $nav=='config' ? 'main-nav__item--active' : '' }}">
            <a href="{!! URL::action('Www\PageController@getConfig') !!}" class="media no-underline">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#shape-compte"></use>
                </svg>
                <span class="media-body navbar-item">Configuration</span>
            </a>
        </li>
    </ul>
</div>