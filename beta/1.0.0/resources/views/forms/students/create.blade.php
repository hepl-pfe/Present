<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('first_name','Prénom',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','first_name',old('first_name'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('last_name','Nom de famille',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','last_name',old('first_name'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::radio('homme','') !!}
    {!! Form::label('homme','male',['class'=>'']) !!}
    {!! Form::radio('femme','') !!}
    {!! Form::label('femme','femelle',['class'=>'']) !!}
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('last_name','La classe',['class'=>'floating-placeholder__label']) !!}
    {!! Form::select('class',['2F'=>'2F'],['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
</div>
<div class="form-group">
    {!! Form::submit('Ajouter l’élève',['class'=>'btn']) !!}
</div>
