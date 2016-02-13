<ul class="box">
    <li class="box-header beta">
        Plage horaire
    </li>
    <li class=" box__item--small">
        {!! Form::model($user,['action' => ['Www\UserController@updateTimeZoneConfig'],'method'=>'patch']) !!}
            @include('forms.users.edit-time',['submit'=>'Mettre à jour les plages horaire'])
        {!! Form::close() !!}
    </li>
</ul>