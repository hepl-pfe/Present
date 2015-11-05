<div role="navigation" class="layout__item u-2/12-desk u-2/12-lap u-12/12-palm main-nav">
    <ul class="list-block">
        <li class="list-block__item">
            <a href="{!! URL::to('/') !!}" class="media">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#home"></use>
                </svg>
                <span class="media-body delta">Paneau de contrôle</span>
            </a>
        </li>
        <li class="list-block__item">
            <a href="{!! URL::to('/cours') !!}" class="media">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#cours"></use>
                </svg>
                <span class="media-body delta">Mes cours</span>
            </a>
        </li>
        <li class="list-block__item">
            <a href="{!! URL::to('/eleves') !!}" class="media">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#power"></use>
                </svg>
                <span class="media-body delta">Mes Élèves</span>
            </a>
        </li>
        <li class="list-block__item">
            <a href="{!! URL::to('/groups') !!}" class="media">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#classes"></use>
                </svg>
                <span class="media-body delta">Mes groupes</span>
            </a>
        </li>
        <li class="list-block__item">
            <a href="{!! URL::to('/teachers') !!}" class="media">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#collegues"></use>
                </svg>
                <span class="media-body delta">Collègues</span>
            </a>
        </li>
        <li class="list-block__item">
            <a href="{!! URL::to('/places') !!}" class="media">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#columns"></use>
                </svg>
                <span class="media-body delta">Locaux</span>
            </a>
        </li>
        <li class="list-block__item">
            <a href="{!! URL::to('/teacher/config/blisntin-stephan') !!}" class="media">
                <svg class="svg-basic svg-nav media__img media__img--svg">
                    <use xlink:href="#compte"></use>
                </svg>
                <span class="media-body delta">Mon compte</span>
            </a>
        </li>
    </ul>
</div>