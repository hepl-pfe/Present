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
       <div class="media">
           <img src="{!! asset('./img/default_profile_picture.jpg') !!}" alt="" class="media__img user-image user-image--small">
           <a href="" class="media__body">
               <span>Votre nom et prénom </span>
               <span>Votre fonction</span>
           </a>
           <div class="dropdown-menu">
               <ul>
                   <li>Blabla</li>
                   <li><a href="">Configuration</a></li>
               </ul>
           </div>
       </div>
    </div>
</div>