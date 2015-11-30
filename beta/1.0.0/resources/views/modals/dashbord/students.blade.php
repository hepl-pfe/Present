<div class="box-header beta">{!! Html::linkAction('Www\StudentController@index','Mes élèves',[],['class'=>'']) !!} {!! link_to_action('Www\StudentController@create','Créer un élève',[],['class'=>'btn btn--add btn--small btn--soft']) !!}</div>
<ul class="box">
    @if(empty(\Auth::user()->students->toArray()))
    <li class="box__item"><span class="link-spacer">Vous n’avez pas encore d’élèves ?</span>
         {!! link_to_action('Www\StudentController@create','Créer un élève',[],['class'=>'']) !!}</li>
    @else
        <?php $i=0; ?>
        @foreach(\Auth::user()->students as $student)
            <li class="box__item">{!! link_to_action('Www\StudentController@show',$student->fullname,['slug'=>$student->slug]) !!}</li>
               <?php if (++$i == 5) break; ?>
        @endforeach
    @endif
</ul>