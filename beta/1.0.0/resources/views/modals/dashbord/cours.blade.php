<h2 class="box-header"> Mes cours</h2>
<ul class="box">
    <li>{!! Html::linkAction('Www\CoursController@create','Créer un cours',[],['class'=>'btn btn--small']) !!}</li>
    @foreach(Auth::user()->cours as $cours)
        <li>{!! Html::linkAction('Www\CoursController@show',$cours->name,['slug'=>$cours->slug],['class'=>'']) !!}</li>
    @endforeach
</ul>