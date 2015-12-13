<ul class="box">
    <li class="box-header beta">{!! Html::linkAction('Www\StudentController@index','Mes élèves',[],['class'=>'link-spacer']) !!}
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
    </li>
    @if(empty(\Auth::user()->students->toArray()))
        <li class="box__item"><span class="link-spacer">Vous n’avez pas encore d’élèves ?</span>
            {!! link_to_action('Www\StudentController@create','Créer un élève',[],['class'=>'']) !!}</li>
    @else
        <?php $i = 0; ?>
        @foreach(\Auth::user()->students as $student)
            <li class="box__item">{!! link_to_action('Www\StudentController@show',$student->fullname,['slug'=>$student->slug]) !!}
                {!!  Form::open(['action' => ['Www\StudentController@destroy'], 'method' => 'delete','class'=>'inline']) !!}
                    {!! Form::hidden('redirect_back',1) !!}
                    {!! Form::hidden('student_id',$student->id) !!}
                <button class="link--alert" class=""
                        data-toggle="tooltip" title="Supprimer l’élève : {!! $student->fullname !!}">
                    <svg class="svg-basic svg--alert">
                        <use xlink:href="#shape-trash"></use>
                    </svg>
                    <span class="visuallyhidden">Supprimer l’élève {!! $student->fullname !!}</span>
                </button>
                {!! Form::close() !!}
                <a href="{!! URL::action('Www\StudentController@edit',['slug'=>$student->slug]) !!}" class=""
                   data-toggle="tooltip" title="Modifier l’élève : {!! $student->fullname !!}">
                    <svg class="svg-basic svg--blue">
                        <use xlink:href="#shape-edit"></use>
                    </svg>
                    <span class="visuallyhidden">Modifier l’élève {!! $student->fullname !!}</span>
                </a>
            </li>
        @endforeach
    @endif
</ul>