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
    {!! Form::input('password','password',old('email'),['class'=>'oPasswordInput floating-placeholder__input--huge floating-placeholder__input']) !!}
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Html::link('#','Montrer le mot de passe',['class'=>'btn-link btn-link--white','id'=>'oLinkPassword']) !!}
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('school','Selectionnez votre institution',['class'=>'floating-placeholder__label floating-placeholder__label--blue']) !!}
    {!! Form::select('school',['le nom d’une seuper belle école']) !!}
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::checkbox('more',old('more'),false) !!}
    {!! Form::label('more','Mon institution n’est pas encore référencée',['class'=>'']) !!}
</div>
{!! Form::submit('S’inscrire',['class'=>'btn  btn--white']) !!}
<div class="form-group">
{!! Html::link('auth/login', 'Je suis déjà membre', array('class' => 'btn-link btn-link--white')) !!}
</div>