<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('name','Le nom de la classe',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','name',old('name'),['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : 2F']) !!}
    @include('errors.error_field',['field'=>'name'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('student_id','Vos elèves',['for'=>'student_id']) !!}
    {!! Form::file('student_id',['class'=>'floating-placeholder__input--huge floating-placeholder__input','multiple','id'=>'student_id']) !!}
    @include('errors.error_field',['field'=>'student_id'])
</div>
<div class="form-group">
    {!! Form::submit($submit,['class'=>'btn']) !!}
</div>