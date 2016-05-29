<ol class="create-pagination">
    <li class="create-pagination__item {{ $nav=="cours" ? 'create-pagination__item--active' : '' }}">
        {!! Html::linkAction('Www\CoursController@create','Créez un cours') !!}
    </li>
    <li class="create-pagination__item {{ $nav=='classes' ? 'create-pagination__item--active' : '' }}">
        {!! Html::linkAction('Www\ClassController@create','Créez un classe') !!}
    </li>
    <li class="create-pagination__item {{ $nav=='students' ? 'create-pagination__item--active' : '' }}">
        {!! Html::linkAction('Www\StudentController@create','Créez un élève') !!}
    </li>
    <?php $user = Auth::user(); ?>
    {{--@if(($user->classes->count() > 0) && ($user->cours->count() > 0)&& ($user->students->count() >0))--}}
        <li class="create-pagination__item {{ Request::is('planificate') ? 'create-pagination__item--active' : '' }}">
            {!! Html::linkAction('Www\PresentController@getPlanificateFull','Planifier des séances') !!}
        </li>
  {{--  @endif--}}
</ol>