<div class="box {{ $cour->isUpdatedNow?'box--animate':'' }} match-height {{ isset($isEdit)?'box--edit':'' }}
@if(isset($meta['create_view_classe_list_block']))
{{ $meta['create_view_classe_list_block']==0?'':'box--classe--list' }}
@endif">
    <div class="box-header delta">
        {!! Html::linkAction('Www\CoursController@show',$cour->name,['slug'=>$cour->slug],['class'=>'link-spacer']) !!}
        <div>
            <a href="{!! URL::action('Www\CoursController@edit',['id'=>$cour->id]) !!}"
               data-toggle="tooltip" title="Modifier le cours : {!! $cour->name !!}">
                <svg class="svg-basic svg--blue">
                    <use xlink:href="#shape-edit"></use>
                </svg>
                <span class="visuallyhidden">Modifier le cours : {!! $cour->name !!}</span>
            </a>
            {!!  Form::open(['action' => ['Www\CoursController@destroy', $cour->id], 'method' => 'delete','class'=>'inline']) !!}
            <button class="link--alert"
                    data-toggle="tooltip" title="Supprimer le cours : {!! $cour->name !!}">
                <svg class="svg-basic svg--alert">
                    <use xlink:href="#shape-trash"></use>
                </svg>
                <span class="visuallyhidden">Supprimer le cours : {!! $cour->name !!}</span>
            </button>
            {!! Form::close() !!}
            <a href="{!! URL::action('Www\PresentController@getPlanificateFullWithCours',['cours_slug'=>$cour->slug]) !!}"
               data-toggle="tooltip"
               title="Planifier une séance à partir du cours : {!! $cour->name !!}">
                <svg class="svg-basic svg--blue">
                    <use xlink:href="#shape-calendar"></use>
                </svg>
                <span class="visuallyhidden">Planifier une séance à partir du cours : {!! $cour->name !!}</span>
            </a>
        </div>
    </div>
    <p><i class="meta-info">Decription&nbsp;:</i> {!! $cour->description !!}</p>

    @if(!is_null($cour->classes))
        <ul class="
         @if(isset($meta['create_view_cours_list_block']))
        {{ $meta['create_view_cours_list_block']==1?'':'visuallyhidden' }}
        @endif
        @if(isset($meta['index_view_cours_list_block']))
        {{ $meta['index_view_cours_list_block']==1?'':'visuallyhidden' }}
        @endif
        ">
            @foreach($cour->classes as $class)
                <li>
                    Classe&nbsp;: {!! link_to_action('Www\ClassController@show',$class->name,[$class->slug],[]) !!}</li>
            @endforeach
        </ul>
    @else
        <p class="alert-danger--soft">Le cours <i>{!! ' '.$cour->name.' ' !!}</i> n’a pas encore de
            classe. {!! Html::linkAction('Www\ClassController@create','Créer une classe') !!}</p>
    @endif
</div>