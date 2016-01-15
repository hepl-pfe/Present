@unless(empty($cours->toArray()))
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge form-group--select">
        {!! Form::label('cours_id','Le nom des cours',['class'=>'floating-placeholder__label']) !!}
        {!! Form::select('cours_id[]',$cours,null,['class'=>'chosen-select floating-placeholder__input--huge floating-placeholder__input','multiple']) !!}
        @include('errors.error_field',['field'=>'cours_id'])
    </div>
@endunless
<div class="form-group">
    {!! Form::submit($submit,['class'=>'btn']) !!}
</div>
