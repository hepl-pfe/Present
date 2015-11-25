<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('classes_id','Le nom des classes',['class'=>'floating-placeholder__label']) !!}
    {!! Form::select('classes_id[]',$class,old('classes_id'),['class'=>'floating-placeholder__input--huge floating-placeholder__input','multiple']) !!}
    @include('errors.error_field',['field'=>'classes_id'])
</div>
<div class="form-group">
    {!! Form::submit($submit,['class'=>'btn']) !!}
</div>
