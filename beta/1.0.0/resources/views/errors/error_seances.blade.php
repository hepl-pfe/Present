@if(($cours->count()>0)&&($classes->count()>0)&&($students->count()>0))
    @include('forms.partials.base-info--important',['message'=>'Vous disposez de tous les éléments pour pouvoir  <a href="'.URL::action('Www\PresentController@getPlanificateFull').'">planifier une séance de cours !</a>'])
@else
    @include('forms.partials.base-info--important',['message'=>'Afin de pouvoir planifier une séance de cours, vous devez avoir enregistré: un cours, et une classe avec des élèves.'])
    <ol class="todo-list">
        @if($cours->count()>0)
            <li class="todo-list__item todo-list__item--succes">
                <svg class="svg-basic svg--success svg--small">
                    <use xlink:href="#shape-checked"></use>
                </svg>
                Vous avez {{$cours->count()}} cours</li>
        @else
            <li class="todo-list__item todo-list__item--alert">
                <svg class="svg-basic svg--alert svg--small">
                    <use xlink:href="#shape-not-valide"></use>
                </svg>
                Vous n’avez pas encore de cours&nbsp;! <a href="{!! URL::action('Www\CoursController@create') !!}">Créez un cours!</a></li>
        @endif
        @if($classes->count()>0)
            <li class="todo-list__item todo-list__item--succes">
                <svg class="svg-basic svg--success svg--small">
                    <use xlink:href="#shape-checked"></use>
                </svg>
                Vous avez {{$classes->count()}} classe<?php echo($classes->count()>0?'s':''); ?></li>
        @else
            <li class="todo-list__item todo-list__item--alert">
                <svg class="svg-basic svg--alert svg--small">
                    <use xlink:href="#shape-not-valide"></use>
                </svg>
                Vous n’avez pas encore d’élèves&nbsp;! <a href="{!! URL::action('Www\ClassController@create') !!}">Créez une classe!</a></li>
        @endif
        @if($students->count()>0)
            <li class="todo-list__item todo-list__item--succes">
                <svg class="svg-basic svg--success svg--small">
                    <use xlink:href="#shape-checked"></use>
                </svg>
                Vous avez {{$students->count()}} élève<?php echo($students->count()>0?'s':''); ?></li>
        @else
            <li class="todo-list__item todo-list__item--alert">
                <svg class="svg-basic svg--alert svg--small">
                    <use xlink:href="#shape-not-valide"></use>
                </svg>
                Vous n’avez pas encore d’élèves&nbsp;! <a href="{!! URL::action('Www\StudentController@create') !!}">Créez un élève!</a></li>
        @endif
    </ol>
@endif