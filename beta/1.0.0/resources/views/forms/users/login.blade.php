<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::text('username',old('username'),['class'=>'']) !!}
    {!! Form::label('username','Votre nom d’utilisateur',['class'=>'']) !!}
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::password('password',old('password'),['class'=>'']) !!}
    {!! Form::label('password','Votre mot de passe',['class'=>'']) !!}
</div>
{!! Form::submit('S’identifier',['class'=>'']) !!}