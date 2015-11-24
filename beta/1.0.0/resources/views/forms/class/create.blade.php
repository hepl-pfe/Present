<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('name','Le nom de la classe',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','name',old('name'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('errors.error_field',['field'=>'name'])
</div>
<div class="form-group">
    {!! Form::submit('Créer la classe',['class'=>'btn']) !!}
</div>
