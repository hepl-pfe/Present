<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('email','Votre adresse email',['class'=>'floating-placeholder__label floating-placeholder__label--blue']) !!}
    {!! Form::input('email','email',old('email'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
</div>

<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('password','Votre mot de passe',['class'=>'floating-placeholder__label floating-placeholder__label--blue']) !!}
    {!! Form::input('password','password',old('email'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
</div>
<div class="form-group">
    {!! Form::checkbox('remember',old('remember'),['class'=>'']) !!}
    {!! Form::label('remember','Se souvenir de moi',['class'=>'floating-placeholder__label floating-placeholder__label--blue']) !!}
</div>
<div class="form-group">
    <a class="btn-link" href="{{ url('/password/email') }}">J’ai oubié mon mot de passe?</a>
    {!! Form::submit('S’identifier',['class'=>'btn  btn--white']) !!}
</div>