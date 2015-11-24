<h2 class="box-header">{!! Html::linkAction('Www\ClassController@index','Les classes',[],['class'=>'']) !!}</h2>
<ul class="box">
    <li class="box__item">{!! link_to_action('Www\ClassController@create','Créer une classe',[],['class'=>'btn btn--small']) !!}</li>
    <li class="box__item">{!! link_to_action('Www\ClassController@index','Voir toutes les classes',[],['class'=>'btn btn--small']) !!}</li>
</ul>