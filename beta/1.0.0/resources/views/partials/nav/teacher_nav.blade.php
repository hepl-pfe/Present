<div role="navigation" class="layout__item main-nav">
    <ul class="list-block">
        <li class="list-block__item">
            <a href="{!! URL::to('/') !!}" class="media no-underline">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#home"></use>
                </svg>
                <span class="media-body navbar-item">Accueil</span>
            </a>
        </li>
        <li class="list-block__item">
            <a href="{!! URL::to('/cours') !!}" class="media no-underline">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#cours"></use>
                </svg>
                <span class="media-body navbar-item">Mes cours</span>
            </a>
        </li>
        <li class="list-block__item">
            <a href="{!! URL::to('/eleves') !!}" class="media no-underline">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#power"></use>
                </svg>
                <span class="media-body navbar-item">Mes élèves</span>
            </a>
        </li>
        <li class="list-block__item">
            <a href="{!! URL::to('/groups') !!}" class="media no-underline">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#classes"></use>
                </svg>
                <span class="media-body navbar-item">Mes groupes</span>
            </a>
        </li>
        <li class="list-block__item">
            <a href="{!! URL::to('/teachers') !!}" class="media no-underline">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#collegues"></use>
                </svg>
                <span class="media-body navbar-item">Collègues</span>
            </a>
        </li>
        <li class="list-block__item">
            <a href="{!! URL::to('/places') !!}" class="media no-underline">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#columns"></use>
                </svg>
                <span class="media-body navbar-item">Locaux</span>
            </a>
        </li>
        <li class="list-block__item">
            <a href="{!! URL::to('/teacher/config/blisntin-stephan') !!}" class="media no-underline">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#compte"></use>
                </svg>
                <span class="media-body navbar-item">Mon compte</span>
            </a>
        </li>
    </ul>
</div>