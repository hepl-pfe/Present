<ul class="box">
    <li class="box-header beta">
        Ajouter un statut
    </li>
    @foreach($statuts as $statut)
        <li class=" box__item--small">
            {{ $statut->name }}
            {{ $statut->color }}
        </li>
    @endforeach
    <li class=" box__item--small">
        {!! Form::open(array('action' => 'Www\StatutController@store')) !!}
        @include('forms.config.present-status',['submit'=>'Ajouter le status de présence'])
        {!! Form::close() !!}
    </li>
</ul>