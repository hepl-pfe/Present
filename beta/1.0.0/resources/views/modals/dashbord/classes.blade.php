<div class="box-header beta">{!! Html::linkAction('Www\ClassController@index','Les classes',[],['class'=>'']) !!} {!! link_to_action('Www\ClassController@create','Créer une classe',[],['class'=>'btn btn--add btn--small btn--soft']) !!}</div>
<ul class="box">
    @if(empty(\Auth::user()->classes->toArray()))
        <li class="box__item">Vous n'avez pas encoore de
            cours, {!! link_to_action('Www\ClassController@create','Créer une classe',[],['class'=>'']) !!}</li>
    @else
        @foreach(\Auth::user()->classes as $classe)
            <li class="box__item">{!! Html::linkAction('Www\ClassController@show',$classe->name,['slug'=>$classe->name],['title'=>'Afiiche la classe']) !!}</li>
        @endforeach
    @endif
</ul>