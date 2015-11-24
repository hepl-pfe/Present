<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('name','Le nom du cours',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','name',old('name'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('errors.error_field',['field'=>'name'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('school_name','Le nom d’une école',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','school_name',old('school_name'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('errors.error_field',['field'=>'school_name'])
</div>
<div class="form-group">
    {!! Form::submit('Créer le cours le cours',['class'=>'btn']) !!}
</div>
