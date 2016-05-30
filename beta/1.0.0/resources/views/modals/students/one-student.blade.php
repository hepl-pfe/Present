<div class="profile-container__box box {{ $student->isUpdatedNow?'box--animate':'' }} match-height">
    <a href="{!! URL::action('Www\StudentController@show',['slug'=>$student->slug]) !!}"
       title="Renvoie vers la fiche de l’élèves {{ $student->fullname }}" class="media">
        <img class="profile-picture media__img user-image profile-picture--present"
             src="{!! asset('./img/default_profile_picture.jpg') !!}"
             alt="Image de l’élève {{ $student->fullname }}" width="50px" height="50px">
        <div class="media__body">
            <span class="profile-name">{!! $student->first_name !!}</span>
            <span class="profile-name">{!! $student->last_name !!}</span>
        </div>
    </a>
    <div>
        <a href="{!! URL::action('Www\StudentController@edit',['id'=>$student->id]) !!}" class="svg-container"
           data-toggle="tooltip" title="Modifier l’élève : {!! $student->fullname !!}">
            <svg class="svg-basic svg--blue">
                <use xlink:href="#shape-edit"></use>
            </svg>
            <span class="visuallyhidden">Modifier l’élève : {!! $student->fullname !!}</span>
        </a>
        {!!  Form::open(['action' => ['Www\StudentController@destroy', $student->id], 'method' => 'delete','class'=>'inline']) !!}
        <button class="link--alert"
                data-toggle="tooltip" title="Supprimer l’élève : {!! $student->fullname !!}">
            <svg class="svg-basic svg--alert">
                <use xlink:href="#shape-trash"></use>
            </svg>
            <span class="visuallyhidden">Supprimer le cours : {!! $student->fullname !!}</span>
        </button>
        {!! Form::close() !!}
    </div>
    <dl class="">
        <dt>Appartient à la classe :</dt>
        <dd>
            @foreach($student->classes as $class)
                {!! Html::linkAction('Www\ClassController@show',$class->name,['classe_slug'=>$class->slug]) !!}
            @endforeach</dd>
        <dt>Ses cours :</dt>
        <dd>
            @foreach($student->classes as $classe)
                @foreach($classe->cours as $cour)
                    {!! Html::linkAction('Www\CoursController@show',$cour->name,['cour_slug'=>$cour->slug]) !!}
                @endforeach
            @endforeach</dd>
    </dl>
</div>