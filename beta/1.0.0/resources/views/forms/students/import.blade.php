<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('csv','Charger la liste de vos élèves',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('file','csv',old('csv'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('errors.error_field',['field'=>'csv'])
</div>
<div class="form-group">
    {!! Form::submit('Importer les élèves',['class'=>'btn']) !!}
</div>
