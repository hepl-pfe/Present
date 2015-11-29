<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('note','La note',['class'=>'floating-placeholder__label']) !!}
    {!! Form::textarea('note',old('note'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('errors.error_field',['field'=>'note'])
</div>
        {!! Form::submit('Ajouter la note',['class'=>'btn']) !!}
