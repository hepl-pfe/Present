<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('first_name','Votre prénom',['class'=>'floating-placeholder__label floating-placeholder__label--blue']) !!}
    {!! Form::input('text','first_name',old('first_name'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('last_name','Votre nom de famille',['class'=>'floating-placeholder__label floating-placeholder__label--blue']) !!}
    {!! Form::input('text','last_name',old('last_name'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('user_name','Votre nom d’utilisateur',['class'=>'floating-placeholder__label floating-placeholder__label--blue']) !!}
    {!! Form::input('text','user_name',old('user_name'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('email','Votre adresse email',['class'=>'floating-placeholder__label floating-placeholder__label--blue']) !!}
    {!! Form::input('email','email',old('email'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
</div>

<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('password','Votre mot de passe',['class'=>'floating-placeholder__label floating-placeholder__label--blue']) !!}
    {!! Form::input('password','password',old('email'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('show_password','Montrer le mot de passe') !!}
    {!! Form::checkbox('show_password','') !!}
</div>
{!! Form::submit('S’inscrire',['class'=>'btn  btn--white']) !!}