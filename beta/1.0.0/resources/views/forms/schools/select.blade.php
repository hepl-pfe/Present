<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge form-group--select">
    {!! Form::label('schools_id','Le nom de l’école',['class'=>'floating-placeholder__label']) !!}
    {!! Form::select('schools_id[]',$schools,null,['class'=>'chosen-select floating-placeholder__input--huge floating-placeholder__input','multiple']) !!}
    @include('errors.error_field',['field'=>'schools_id'])
</div>
<div class="form-group">
    {!! Form::submit($submit,['class'=>'btn']) !!}
</div>
