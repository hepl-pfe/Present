<?php $schools=Auth::user()->schools ?>
<h2 class="box-header">{!! link_to_action('Www\UserController@index','Mes collègues') !!}</h2>
<ul class="box">
    <li class="box__item"><a href="#" class="btn btn--small">Inviter des collègues à connaître cet outil.</a></li>
</ul>