<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('name','Le nom de la classe',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','name',old('name'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('errors.error_field',['field'=>'name'])
</div>
@unless(empty($schools->toArray()))
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge form-group--select">
    {!! Form::label('schools_id','Le nom des classes',['class'=>'floating-placeholder__label']) !!}
    {!! Form::select('schools_id[]',$schools,old('schools_id'),['class'=>'floating-placeholder__input--huge floating-placeholder__input','multiple']) !!}
    @include('errors.error_field',['field'=>'schools_id'])
</div>
@endunless
<div class="form-group">
    {!! Form::submit('Créer la classe',['class'=>'btn']) !!}
</div>
