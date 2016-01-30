<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('name','Votre nom',['class'=>'floating-placeholder__label floating-placeholder__label--white']) !!}
    {!! Form::input('text','name',old('name'),['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : Jane']) !!}
    @include('errors.error_field',['field'=>'name'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('email','Votre adresse email',['class'=>'floating-placeholder__label floating-placeholder__label--white']) !!}
    {!! Form::input('email','email',old('email'),['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : jane.doe@domaine.com']) !!}
    @include('forms.partials.base-info',['message'=>'C’est avec cette adresse mail ci que vous devrez vous identifier'])
    @include('errors.error_field',['field'=>'email'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('password','Votre mot de passe',['class'=>'floating-placeholder__label floating-placeholder__label--white']) !!}
    {!! Form::input('password','password',old('password'),['class'=>'oPasswordInput floating-placeholder__input--huge floating-placeholder__input']) !!}
    <a href="#" class="form-group__svg" id="oLinkPassword">
        <svg class="svg-basic svg--blue">
            <use xlink:href="#shape-locked"></use>
        </svg>
    </a>
    @include('errors.error_field',['field'=>'password'])
</div>
<div class="form-group">
    {!! Form::submit('S’inscrire',['class'=>'btn']) !!}
    {!! Html::linkAction('AuthController@login','Github',[],['class'=>'btn']) !!}
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Html::link('auth/login','S’identifier',['class'=>'btn-link']) !!}
</div>
