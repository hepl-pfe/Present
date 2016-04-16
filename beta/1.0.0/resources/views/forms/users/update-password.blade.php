<div class="floating-placeholder form-group floating-placeholder-float--huge">
    {!! Form::label('password','Votre mot de passe',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('password','password',old('password'),['class'=>'oPasswordInput floating-placeholder__input--huge floating-placeholder__input']) !!}
    <a href="#" title="Monter/cacher le mot de passe" data-toggle="tooltip" class="form-group__svg form-group__svg--white" id="oLinkPassword">
        <svg class="svg-basic svg--blue">
            <use xlink:href="#shape-iris_close"></use>
        </svg>
    </a>
    @include('errors.error_field',['field'=>'password'])
</div>
<div class="form-group">
    {!! Form::submit($submit,['class'=>'btn']) !!}
</div>