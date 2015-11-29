<div class="box-header beta">Mes
    cours {!! link_to_action('Www\CoursController@create','Créer un cours !',[],['class'=>'btn btn--add btn--small btn--soft']) !!}</div>
<ul class="box">
    @if(empty(\Auth::user()->cours))
        <li class="box__item"><span class="link-spacer">Vous n'avez pas encore de
            cours</span> {!! link_to_action('Www\CoursController@create','Créer un cours !',[],['class'=>'']) !!}</li>
    @else
        @foreach(Auth::user()->cours as $cours)
            <li class="box__item">
                    {!! Html::linkAction('Www\CoursController@show',$cours->name,['slug'=>$cours->slug],['class'=>'link--black link-spacer']) !!}
                @if($cours->hasOccurrence)
                    {!! link_to_action('Www\PresentController@getAllStudentfromOneOccurrence','Prendre les présences',['id'=>$cours->getOccurrence->id],['class'=>'']) !!}
                @endif
            </li>
        @endforeach
    @endif
</ul>