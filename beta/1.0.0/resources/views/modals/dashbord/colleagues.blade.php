<?php $schools=Auth::user()->schools ?>
<h2 class="box-header">Mes collègues</h2>
<ul class="box">
    @if(empty($schools->toArray()))
            <li class="">Vous n’êtes pas encore <b>membre d'une école</b> ?
                Faites votre <b>demande d'adhésion</b> à une école existante ou créez la vôtre.
                {!! Html::linkAction('Www\SchoolController@getConfig','Aller à la configuration',[],['class'=>'']) !!}
            </li>

    @else
        @if(count(count($schools->toArray())==1))
            <li class="">Pas encore de <b>collègues</b>?  Demandez à vos collègues de venir <b>s'inscrire.</b></li>
        @else
            @foreach($schools as $school)
                @foreach($school->users as $user)
                    @unless($user->id == Auth::user()->id)
                        <li class="">
                            <a href="{!! URL::action('Www\UserController@show',['school_slug'=>$school->slug,'user_slug'=>$user->slug]) !!}" title="Renvoie vers la fiche de " class="">
                                {!! $user->first_name !!}&nbsp;{!! $user->last_name !!}
                            </a>
                        </li>
                    @endunless
                @endforeach
            @endforeach
        @endif
    @endif
</ul>