@unless(empty($students->toArray()))
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge form-group--select">
    {!! Form::label('students_id','Le nom des classes',['class'=>'floating-placeholder__label']) !!}
    {!! Form::select('students_id[]',$students,old('students_id'),['class'=>'floating-placeholder__input--huge floating-placeholder__input','multiple']) !!}
    @include('errors.error_field',['field'=>'students_id'])
</div>
@endunless
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('csv','Charger la liste de vos élèves',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('file','csv',old('csv'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('errors.error_field',['field'=>'csv'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('name','Le nom de la classe',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','name',null,['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('errors.error_field',['field'=>'name'])
</div>
<div class="form-group">
    {!! Form::submit($submit,['class'=>'btn']) !!}
</div>
