<div class="layout__item u-2/12-desk u-2/12-lap u-12/12-pal header-item header-item--left media">
    <a class="media__img" href="{!! URL::to('/')!!}">
        <img src="{!! asset('img/default_profile_picture.jpg') !!}" alt="" class="user-image--small user-image">
    </a>
    <span class="media__body">Votre nom</span>
</div>
<div class="layout__item u-10/12-desk u-10/12-lap u-12/12-palm header-item header-item--right">
    <div class="layout__item u-6/12">
        @include('forms.search.search')
    </div>
    <div class="layout__item u-6/12 text--right">
        <a href="">
            <svg class="styling-class">
                <title>Se déconecter</title>
                <use xlink:href="#power"></use>
            </svg>
        </a>
        <a href="">
            <svg class="styling-class">
                <title>Notifications</title>
                <use xlink:href="#notifications"></use>
            </svg>
        </a>
    </div>
</div>