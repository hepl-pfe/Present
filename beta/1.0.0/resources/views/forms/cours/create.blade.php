<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('name','Le nom du cours',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','name',old('name'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('forms.partials.base-info',['message'=>'Il vous suffit d’entrer un nom arbitraire de la classe que vous voulez créer'])
    @include('errors.error_field',['field'=>'name'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('description','Une description du cours',['class'=>'floating-placeholder__label']) !!}
    {!! Form::textarea('description',old('description'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('forms.partials.base-info',['message'=>'Vous pouvez introduire une petite description, celle-ci est optionnelle'])
    @include('errors.error_field',['field'=>'description'])
</div>
<div class="form-group">
    {!! Form::submit($submit,['class'=>'btn']) !!}
</div>
