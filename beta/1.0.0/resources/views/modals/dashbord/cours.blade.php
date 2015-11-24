<div class="box-header beta">Mes cours {!! link_to_action('Www\CoursController@create','Créer un cours !',[],['class'=>'btn btn--add btn--small btn--soft']) !!}</div>
<ul class="box">
    <li class="box__item"></li>
    @foreach(Auth::user()->cours as $cours)
        <li class="box__item">{!! Html::linkAction('Www\CoursController@show',$cours->name,['slug'=>$cours->slug],['class'=>'']) !!}</li>
    @endforeach
</ul>