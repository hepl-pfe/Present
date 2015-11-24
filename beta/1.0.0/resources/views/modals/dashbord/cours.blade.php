<h2 class="box-header">Mes cours</h2>
<ul class="box">
    <li class="box__item">{!! link_to_action('Www\UserController@getStarted','Créer un cours !',['start_step'=>1],['class'=>'btn']) !!}</li>
    @foreach(Auth::user()->cours as $cours)
        <li class="box__item">{!! Html::linkAction('Www\CoursController@show',$cours->name,['slug'=>$cours->slug],['class'=>'']) !!}</li>
    @endforeach
</ul>