{!! Form::open(['url' => '/']) !!}
<fieldset>
    <legend>Vos coordonnées</legend>
    {!! Form::text('name','Votre prénom') !!}
    {!! Form::text('name',old('name'),['class'=>'']) !!}
    {!! Form::text('surname','Votre nom de famille') !!}
    {!! Form::text('surname',old('surname'),['class'=>'']) !!}
    {!! Form::text('username','Votre nom de famille') !!}
    {!! Form::text('username',old('surname'),['class'=>'']) !!}

    {!! Form::label('email', 'Votre adresse mail') !!}
    {!! Form::text('email','',['class'=>'']) !!}
    {!! Form::label('password', 'Votre mot de passe') !!}
    {!! Form::text('password','',['class'=>'']) !!}
</fieldset>
<fieldset>
    <legend>Les cordonnées de l’institition</legend>
    {!! Form::label('institution_type','Le type de l’institition') !!}
    {!! Form::select('institution_type',['asbl'=>'A.S.B.L','ecole_maternelle'=>'École maternelle','ecole_secondaire'=>'École seconfaire'],null,['class'=>'']) !!}
    {!! Form::label('institution_name', 'Le nom complet de votre école') !!}
    {!! Form::text('institution_name','',['class'=>'']) !!}
</fieldset>
{!! Form::submit('Enregistrer Votre ecole',['class'=>'']) !!}
{!! Form::close() !!}