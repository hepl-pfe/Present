{!! Form::open(['url' => '/']) !!}
<fieldset class="welcome-fieldset">
    <legend>Vos coordonnées</legend>
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
        {!! Form::text('name',old('name'),['class'=>'']) !!}
        {!! Form::label('name','Votre prénom',['class'=>'']) !!}
        @include('errors.error_field',['field'=>'name'])
    </div>
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
        {!! Form::text('surname',old('surname'),['class'=>'']) !!}
        {!! Form::label('surname','Votre nom de famille',['class'=>'']) !!}
        @include('errors.error_field',['field'=>'surname'])
    </div>
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
        {!! Form::text('email','',['class'=>'']) !!}
        {!! Form::label('email', 'Votre adresse mail',['class'=>'']) !!}
        @include('errors.error_field',['field'=>'email'])
    </div>
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
        {!! Form::text('password','',['class'=>'']) !!}
        {!! Form::label('password', 'Votre mot de passe',['class'=>'']) !!}
        @include('errors.error_field',['field'=>'password'])
    </div>
</fieldset>
<fieldset class="welcome-fieldset">
    <legend>Les cordonnées de l’institition</legend>
    <div class="form-group">
        {!! Form::label('institution_type','Le type de l’institition') !!}
        {!! Form::select('institution_type',['asbl'=>'A.S.B.L','ecole_maternelle'=>'École maternelle','ecole_secondaire'=>'École seconfaire'],null,['class'=>'']) !!}
        @include('errors.error_field',['field'=>'institution_type'])
    </div>
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
        {!! Form::text('institution_name','',['class'=>'']) !!}
        {!! Form::label('institution_name', 'Le nom complet de votre école',['class'=>'']) !!}
        @include('errors.error_field',['field'=>'institution_name'])
    </div>
</fieldset>
{!! Form::submit('Enregistrer Votre ecole',['class'=>'']) !!}
{!! Form::close() !!}