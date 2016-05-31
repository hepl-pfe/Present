<ul class="box">
    <li class="box-header beta">{!! Html::linkAction('Www\StudentController@index','Mes élèves',[],['class'=>'link-spacer']) !!}
        <a href="{!! URL::action('Www\StudentController@create') !!}" class="svg-container"
           data-toggle="tooltip" title="Créer un élève" data-form="create-student-form">
            <svg class="svg-basic svg--blue">
                <use xlink:href="#shape-create"></use>
            </svg>
        </a>
        <a href="{!! URL::action('Www\StudentController@getImportStudentsList') !!}" class="svg-container visuallyhidden--palm"
           data-toggle="tooltip" title="Importer une liste d’élèves">
            <svg class="svg-basic svg--blue">
                <use xlink:href="#shape-import"></use>
            </svg>
        </a>
    </li>
    @if($students->total()==0)
        <li class="box__item"><span class="link-spacer">Vous n’avez pas encore d’élèves ?</span>
            {!! link_to_action('Www\StudentController@create','Créer un élève',[],['class'=>'','data-form'=>'create-student-form']) !!}
        </li>
    @else
        <li>
            {!! Form::open(['action'=>'Www\SearchController@mainSearch','method'=>'get','class'=>'box__search--small']) !!}
            @include('forms.search.students.search')
            {!! Form::close() !!}
        </li>
        @foreach($students as $student)
            <li class="box__item">
                <div class="box__item__body">
                    {!! link_to_action('Www\StudentController@show',$student->fullname,['slug'=>$student->slug]) !!}
                </div>
                <div class="box__item__actions">
                    {!!  Form::open(['action' => ['Www\StudentController@destroy', $student->id], 'method' => 'delete','class'=>'inline']) !!}
                    {!! Form::hidden('redirect_back',1) !!}
                    {!! Form::hidden('student_id',$student->id) !!}
                    <button class="link--alert"
                            data-toggle="tooltip" title="Supprimer l’élève : {!! $student->fullname !!}"
                            data-form="delete-class-form--{!! $student->slug !!}">
                        <svg class="svg-basic svg--alert">
                            <use xlink:href="#shape-trash"></use>
                        </svg>
                        <span class="visuallyhidden">Supprimer l’élève {!! $student->fullname !!}</span>
                    </button>
                    {!! Form::close() !!}
                    <a href="{!! URL::action('Www\StudentController@edit',['slug'=>$student->slug]) !!}"
                       data-toggle="tooltip" title="Modifier l’élève : {!! $student->fullname !!}"
                       data-form="edit-student-form--{!! $student->slug !!}">
                        <svg class="svg-basic svg--blue">
                            <use xlink:href="#shape-edit"></use>
                        </svg>
                        <span class="visuallyhidden">Modifier l’élève {!! $student->fullname !!}</span>
                    </a>


                    <div class="form-hidde delete-class-form--{!! $student->slug !!}">
                        {!!  Form::open(['action' => ['Www\StudentController@destroy', $student->id], 'method' => 'delete','class'=>'']) !!}
                        {!! Form::hidden('redirect_back',1) !!}
                        <a href="#" data-form="delete-class-form--{!! $student->slug !!}" class="hide-modal--top">
                            <svg class="hide-modal--top__svg svg--alert">
                                <use xlink:href="#shape-close-modal"></use>
                            </svg>
                            <span class="visuallyhidden">fermer la fenêtre</span>
                        </a>
                        <p>Vous êtes sur le point de supprimer l'élève : {!! $student->fullname !!}</p>
                        <div class="text--center btn-container">
                            <button class=" btn btn--small btn--red-svg btn--alert"
                                    title="Supprimer l'élève : {!! $student->fullname !!}">
                                <svg class="svg-basic svg--white">
                                    <use xlink:href="#shape-trash"></use>
                                </svg>
                                <span>Supprimer l'élève {!! $student->fullname !!}</span>
                            </button>
                        </div>
                        <a href="#" data-form="delete-class-form--{!! $student->slug !!}">fermer la fenêtre</a>
                        {!! Form::close() !!}
                    </div>


                    <div class="form-hidde edit-student-form--{!! $student->slug !!}">
                        {!! Form::model($student,['action' => ['Www\StudentController@update','id'=>$student->slug],'method'=>'patch']) !!}
                        <a href="#" data-form="edit-student-form--{!! $student->slug !!}" class="hide-modal--top">
                            <svg class="hide-modal--top__svg svg--alert">
                                <use xlink:href="#shape-close-modal"></use>
                            </svg>
                            <span class="visuallyhidden">fermer la fenêtre</span>
                        </a>
                        @include('forms.students.edit',['submit'=>'Modifier l’élève '.$student->fullname])
                        <a href="#" data-form="edit-student-form--{!! $student->slug !!}">fermer la fenêtre</a>
                        {!! Form::close() !!}
                    </div>
                </div>
            </li>
        @endforeach
        <li>
            @include('pagination.default', ['paginator' => $students])
        </li>
    @endif
    <li class="form-hidde create-student-form">
        {!! Form::open(['action' => 'Www\StudentController@store','class'=>'']) !!}
        <a href="#" data-form="create-student-form" class="hide-modal--top">
            <svg class="hide-modal--top__svg svg--alert">
                <use xlink:href="#shape-close-modal"></use>
            </svg>
            <span class="visuallyhidden">fermer la fenêtre</span>
        </a>
        @include('forms.students.create')
        <a href="#" data-form="create-student-form">fermer la fenêtre</a>
        {!! Form::close() !!}
    </li>

</ul>