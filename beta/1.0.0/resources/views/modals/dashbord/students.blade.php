<div class="box-header beta">{!! Html::linkAction('Www\StudentController@index','Mes élèves',[],['class'=>'link-spacer']) !!}
    <a href="{!! URL::action('Www\StudentController@create') !!}" class=""
       data-toggle="tooltip" title="Ajouter un élève">
        <svg class="svg-basic svg--blue">
            <use xlink:href="#shape-create"></use>
        </svg>
    </a>
    <a href="{!! URL::action('Www\StudentController@getImportStudentsList') !!}" class=""
       data-toggle="tooltip" title="Importer une liste d’élèves">
        <svg class="svg-basic svg--blue">
            <use xlink:href="#shape-import"></use>
        </svg>
    </a>
</div>
<ul class="box">
    @if(empty(\Auth::user()->students->toArray()))
        <li class="box__item"><span class="link-spacer">Vous n’avez pas encore d’élèves ?</span>
            {!! link_to_action('Www\StudentController@create','Créer un élève',[],['class'=>'']) !!}</li>
    @else
        <?php $i = 0; ?>
        @foreach(\Auth::user()->students as $student)
            <li class="box__item">{!! link_to_action('Www\StudentController@show',$student->fullname,['slug'=>$student->slug]) !!}</li>
            <?php if (++$i == 4) break; ?>
        @endforeach

        <li class="box__item">{!! link_to_action('Www\StudentController@index','...',[]) !!}</li>

    @endif
</ul>