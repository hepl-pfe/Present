<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    <label for="edit-classe-{!! $classe->name !!}" class="floating-placeholder__label">Le nom de la classe @include('forms.partials.required')</label>
    {!! Form::input('text','name',null,['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : 2F','id'=>'edit-classe-'.$classe->name]) !!}
    @include('errors.error_field',['field'=>'name'])
</div>
@if(!empty($students->toArray()))
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge form-group--select">
        <label for="{{$classe->name}}" class="floating-placeholder__label">Sélectionnez vos élèves</label>
        {!! Form::select('students_id[]',$students,$selected_student,['class'=>'chosen-select floating-placeholder__input--huge floating-placeholder__input','multiple','id'=>'s']) !!}
        @include('errors.error_field',['field'=>'students_id'])
    </div>
@endif
@if(!empty($schools->toArray()))
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge form-group--select">
        {!! Form::label('schools_id','Le nom des écoles',['class'=>'floating-placeholder__label']) !!}
        {!! Form::select('schools_id[]',$schools,old('schools_id'),['class'=>'chosen-select floating-placeholder__input--huge floating-placeholder__input','multiple','id'=>'schools_id']) !!}
        @include('errors.error_field',['field'=>'schools_id'])
    </div>
@endif
@include('forms.partials.required--message')
<div class="form-group">
    {!! Form::submit($submit,['class'=>'btn']) !!}
</div>

