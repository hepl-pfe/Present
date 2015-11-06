{!! Form::open(['url' => '/']) !!}
<fieldset>
    <legend>Vos coordonnées</legend>
    <div class="form-group">
        {!! Form::text('name',old('name'),['class'=>'']) !!}
        {!! Form::label('name','Votre prénom',['class'=>'label-paceholder']) !!}
    </div>
    <div class="form-group">
        {!! Form::text('surname',old('surname'),['class'=>'']) !!}
        {!! Form::label('surname','Votre nom de famille',['class'=>'label-paceholder']) !!}
    </div>
    <div class="form-group">
        {!! Form::text('username',old('surname'),['class'=>'']) !!}
        {!! Form::label('username','Votre nom de famille',['class'=>'label-paceholder']) !!}
    </div>
    <div class="form-group">
        {!! Form::text('email','',['class'=>'']) !!}
        {!! Form::label('email', 'Votre adresse mail',['class'=>'label-paceholder']) !!}
    </div>
    <div class="form-group">
        {!! Form::text('password','',['class'=>'']) !!}
        {!! Form::label('password', 'Votre mot de passe',['class'=>'label-paceholder']) !!}
    </div>
</fieldset>
<fieldset>
    <legend>Les cordonnées de l’institition</legend>
    <div class="form-group">
        {!! Form::label('institution_type','Le type de l’institition') !!}
        {!! Form::select('institution_type',['asbl'=>'A.S.B.L','ecole_maternelle'=>'École maternelle','ecole_secondaire'=>'École seconfaire'],null,['class'=>'']) !!}
    </div>
    <div class="form-group">
        {!! Form::text('institution_name','',['class'=>'']) !!}
        {!! Form::label('institution_name', 'Le nom complet de votre école',['class'=>'label-paceholder']) !!}
    </div>
</fieldset>
{!! Form::submit('Enregistrer Votre ecole',['class'=>'']) !!}
{!! Form::close() !!}