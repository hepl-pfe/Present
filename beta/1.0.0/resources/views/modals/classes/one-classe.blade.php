<ul class="box {{ $classe->isUpdatedNow?'box--animate':'' }} match-height">
    <li class="box-header gamma">
        {!! Html::linkAction('Www\ClassController@show',$classe->name,['slug'=>$classe->slug],['class'=>'block']) !!}
        <a href="{!! URL::action('Www\ClassController@edit',['id'=>$classe->id]) !!}"
           class="svg-container"
           data-toggle="tooltip" title="Éditer la classe de : {!! $classe->name !!}">
            <svg class="svg-basic svg--blue">
                <use xlink:href="#shape-edit"></use>
            </svg>
        </a>
        {!!  Form::open(['action' => ['Www\ClassController@destroy', $classe->id], 'method' => 'delete','class'=>'inline']) !!}
        <button class="link--alert"
                data-toggle="tooltip" title="Supprimer la classe : {!! $classe->name !!}">
            <svg class="svg-basic svg--alert">
                <use xlink:href="#shape-trash"></use>
            </svg>
            <span class="visuallyhidden">Supprimer la classe {!! $classe->name !!}</span>
        </button>
        {!! Form::close() !!}
    </li>
    <li>
        <ul>
            @foreach($classe->students()->alphabetic()->get() as $student)
                <li>
                    {!! link_to_action('Www\StudentController@show',$student->fullname,['slug'=>$student->slug],[]) !!}
                </li>
            @endforeach
        </ul>
    </li>
</ul>