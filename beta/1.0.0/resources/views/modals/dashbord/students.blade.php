<div class="box-header beta">{!! Html::linkAction('Www\StudentController@index','Mes élèves',[],['class'=>'']) !!} {!! link_to_action('Www\StudentController@create','Créer un élève',[],['class'=>'btn btn--add btn--small btn--soft']) !!}</div>
<ul class="box">
    @if(empty(\Auth::user()->students->toArray()))
    <li class="box__item">Vous n’avez pas encore d’élèves {!! link_to_action('Www\StudentController@create','Créer un élève',[],['class'=>'']) !!}</li>
    @else
        @foreach(\Auth::user()->students as $student)
            <li class="box__item">{!! link_to_action('Www\StudentController@show',$student->fullname,['slug'=>$student->slug]) !!}</li>
        @endforeach
    @endif
</ul>