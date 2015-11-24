<?php $user= Auth::user() ?>
<h2 class="box-header">Mon compte</h2>
<div class="box">
    <div class="box__item">{!! Html::linkAction('Www\UserController@getBindEventForm','Créer son horaire',[],['title'=>'Renvoie vers le formulaire ...','class'=>'btn btn--small']) !!}</div>
    <p class="box__item">{!! $user->first_name !!} {!! $user->last_name !!}</p>
    <p class="box__item">15 heures de cours</p>
    <p class="box__item">200 élèves</p>
</div>