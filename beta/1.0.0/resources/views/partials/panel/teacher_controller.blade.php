<div class="layout">
    <div class="layout__item u-8/12">
        @include('forms.search.search')
    </div>
    <a href=""  class="layout__item u-1/12">
        <svg class="svg-basic">
            <title>Notifications</title>
            <use xlink:href="#notifications"></use>
        </svg>
    </a>
    <div class="layout__item u-3/12">
       <div class="media dropdown-menu-container dropdown-menu-container--hover">
           <img src="{!! asset('./img/default_profile_picture.jpg') !!}" alt="" class="media__img user-image user-image--small">
           <a href="" class="media__body header-meta no-underline">
               <span class="header-meta__item">Votre nom et prénom </span>
               <span class="header-meta__item">Votre fonction</span>
               <svg class="svg-basic dropdown-menu__arraw">
                   <title>flèche vers le bas</title>
                   <use xlink:href="#down"></use>
               </svg>
           </a>
           <div class="dropdown-menu">
               <ul>
                   <li class="dropdown-menu__item">Blabla</li>
                   <li class="dropdown-menu__item"><a href="">Configuration</a></li>
               </ul>
           </div>
       </div>
    </div>
</div>