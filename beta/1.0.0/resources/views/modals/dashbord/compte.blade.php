<?php $user= Auth::user() ?>
<h2 class="box-header">{!! Html::linkAction('Www\UserController@getConfig','Mon compte',[],['title'=>'Renvoie vers la configuration de votre compte']) !!}</h2>
<div class="box">
    <p class="box__item">{!! $user->first_name !!} {!! $user->last_name !!}</p>
    <p class="box__item">15 heures de cours</p>
    <p class="box__item">200 élèves</p>
</div>