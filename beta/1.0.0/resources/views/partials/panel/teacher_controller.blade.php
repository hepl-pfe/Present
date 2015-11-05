<div class="">
    <div class="2">
        @include('forms.search.search')
    </div>
    <div class="">
        <a href="">
            <svg class="svg-basic">
                <title>Se déconecter</title>
                <use xlink:href="#power"></use>
            </svg>
        </a>
        <a href="">
            <svg class="svg-basic">
                <title>Notifications</title>
                <use xlink:href="#notifications"></use>
            </svg>
        </a>
        <div class="">
            <a class="" href="{!! URL::to('/')!!}">
                <img src="{!! asset('img/default_profile_picture.jpg') !!}" alt="" class="user-image--small user-image">
            </a>
            <span class="">Votre nom</span>
        </div>
    </div>
</div>