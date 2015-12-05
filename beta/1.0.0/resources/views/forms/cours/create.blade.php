<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('name','Le nom du cours',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','name',old('name'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('errors.error_field',['field'=>'name'])
</div>
@unless(empty(Auth::user()->schools->toArray()))
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('schools_id','Le nom de l’école',['class'=>'floating-placeholder__label']) !!}
    {!! Form::select('schools_id',$schools,null,['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('errors.error_field',['field'=>'schools_id'])
</div>
@endunless
@unless(empty(Auth::user()->classes->toArray()))
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('classes_id','Le nom des classes',['class'=>'floating-placeholder__label']) !!}
    {!! Form::select('classes_id[]',$classes,old('classes_id'),['class'=>'floating-placeholder__input--huge floating-placeholder__input load-students-from-cour','multiple']) !!}
    @include('errors.error_field',['field'=>'classes_id'])
</div>
@endunless
<div class="form-group">
    {!! Form::submit($submit,['class'=>'btn']) !!}
</div>
