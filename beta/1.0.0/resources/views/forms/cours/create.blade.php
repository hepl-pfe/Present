<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('name','Le nom du cours',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','name',old('name'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('errors.error_field',['field'=>'name'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('class','Plage à laquel le cours se donne',['class'=>'floating-placeholder__label']) !!}
    {!! Form::select('class',['08:30-09-20'=>'2F'],['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('errors.error_field',['field'=>'class'])
</div>
<div class="form-group">
    {!! Form::submit('Ajouter le cours',['class'=>'btn']) !!}
</div>
