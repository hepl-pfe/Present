<article class="box {{ $classe->isUpdatedNow?'box--animate':'' }} match-height {{ isset($isEdit)?'box--edit':'' }}
@if(isset($isCreate))
{{ $meta['create_view_classe_list_block']==1?'':'box--classe--list' }}
@endif">
    <div class="box-header {{ isset($isCreate)?'delta':'beta' }}">
        <h2>{!! Html::linkAction('Www\ClassController@show',$classe->name,['slug'=>$classe->slug],['class'=>'block']) !!}</h2>
        <a href="{!! URL::action('Www\ClassController@edit',['id'=>$classe->id]) !!}"
           class="svg-container"
           data-toggle="tooltip" title="Éditer la classe de : {!! $classe->name !!}">
            <svg class="svg-basic svg--blue">
                <use xlink:href="#shape-edit"></use>
            </svg>
        </a>
        @unless(isset($isEdit))
            {!!  Form::open(['action' => ['Www\ClassController@destroy', $classe->id], 'method' => 'delete','class'=>'inline']) !!}
            <button class="link--alert"
                    data-toggle="tooltip" title="Supprimer la classe : {!! $classe->name !!}"
                    data-form="delete-class-form--{!! $classe->slug !!}">
                <svg class="svg-basic svg--alert">
                    <use xlink:href="#shape-trash"></use>
                </svg>
                <span class="visuallyhidden">Supprimer la classe {!! $classe->name !!}</span>
            </button>
            {!! Form::close() !!}
        @endunless
    </div>
    <div class="
    @if(isset($isCreate))
    {{ $meta['create_view_classe_list_block']==1?'':'visuallyhidden' }}
    @endif
    @if(isset($isIndex))
    {{ $meta['index_view_classe_list_block']==1?'':'visuallyhidden' }}
    @endif
            ">
        <ul>
            @foreach($classe->students()->alphabetic()->get() as $student)
                <li>
                    {!! link_to_action('Www\StudentController@show',$student->fullname,['slug'=>$student->slug],[]) !!}
                </li>
            @endforeach
        </ul>
    </div>
    @unless(isset($isEdit))
        <div class="form-hidde delete-class-form--{!! $classe->slug !!}">
            {!!  Form::open(['action' => ['Www\ClassController@destroy', $classe->id], 'method' => 'delete','class'=>'']) !!}
            <a href="#" data-form="delete-class-form--{!! $classe->slug !!}" class="hide-modal--top">
                <svg class="hide-modal--top__svg svg--alert">
                    <use xlink:href="#shape-close-modal"></use>
                </svg>
                <span class="visuallyhidden">fermer la fenêtre</span>
            </a>
            <p>Vous êtes sur le point de supprimer la classe : {!! $classe->name !!}</p>
            <div class="text--center btn-container">
                <button class=" btn btn--small btn--red-svg btn--alert"
                        title="Supprimer la classe : {!! $classe->name !!}">
                    <svg class="svg-basic svg--white">
                        <use xlink:href="#shape-trash"></use>
                    </svg>
                    <span>Supprimer la classe {!! $classe->name !!}</span>
                </button>
            </div>
            <a href="#" data-form="delete-class-form--{!! $classe->slug !!}">fermer la fenêtre</a>
            {!! Form::close() !!}
        </div>
    @endunless
</article>