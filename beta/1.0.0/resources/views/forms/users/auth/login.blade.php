<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('email','Votre adresse email',['class'=>'floating-placeholder__label floating-placeholder__label--blue']) !!}
    {!! Form::input('email','email',old('email'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('errors.error_field',['field'=>'email'])
</div>

<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('password','Votre mot de passe',['class'=>'floating-placeholder__label floating-placeholder__label--blue']) !!}
    {!! Form::input('password','password','',['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('errors.error_field',['field'=>'password'])
</div>
<div class="form-group">
    {!! Form::label('remember','Se souvenir de moi',['class'=>'']) !!}
    {!! Form::checkbox('remember',old('remember'),['class'=>'']) !!}
</div>
<div class="form-group">
    {!! Form::submit('S’identifier',['class'=>'btn  btn--white']) !!}
</div>
<div class="form-group">
    <a class="btn-link btn-link--white" href="{{ url('/password/email') }}">J’ai oubié mon mot de passe?</a>
    {!! Html::link('auth/register', 'Je ne suis pas encore membre', array('class' => 'btn-link btn-link--white')) !!}
</div>