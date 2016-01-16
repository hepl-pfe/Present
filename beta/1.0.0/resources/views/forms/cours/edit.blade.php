<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('name','Le nom du cours',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','name',null,['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : Français']) !!}
    @include('errors.error_field',['field'=>'name'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('description','Une description du cours',['class'=>'floating-placeholder__label']) !!}
    {!! Form::textarea('description',null,['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : Un simple petit texte qui décrit le cours']) !!}
    @include('errors.error_field',['field'=>'description'])
</div>
<div class="form-group">
    {!! Form::submit($submit,['class'=>'btn']) !!}
</div>
