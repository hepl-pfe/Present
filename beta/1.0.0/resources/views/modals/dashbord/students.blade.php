<div class="box-header beta">{!! Html::linkAction('Www\StudentController@index','Mes élèves',[],['class'=>'']) !!} {!! link_to_action('Www\StudentController@create','Créer un élève',[],['class'=>'btn btn--add btn--small btn--soft']) !!}</div>
<ul class="box">
    @if(empty(\Auth::user()->students->toArray()))
    <li class="box__item">Vous n’avez pas encore d’élèves {!! link_to_action('Www\StudentController@create','Créer un élève',[],['class'=>'']) !!}</li>
    @else
        @foreach(\Auth::user()->students as $student)
            <li class="box__item">{!! Html::link('/eleves/blisntin-stephan',$student->first_name.' '.$student->last_name,[]) !!}</li>
        @endforeach
    @endif
</ul>