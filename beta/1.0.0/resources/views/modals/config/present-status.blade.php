<ul class="box">
    <li class="box-header beta">
        Ajouter un statut
    </li>
    <li class=" box__item--small">
        {!! Form::model(['action' => ['Www\UserController@updateTimeZoneConfig'],'method'=>'patch']) !!}
            @include('forms.config.present-status',['submit'=>'Ajouter le status de présence'])
        {!! Form::close() !!}
    </li>
</ul>