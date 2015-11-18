@if(count($schools)==1)
<input type="hidden" name="school_id" value="{!! Auth::user()->schools[0]->id !!}">
@else
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('school_id','Le nom de l’école',['class'=>'floating-placeholder__label']) !!}
    {!! Form::select('school_id',$schools,old('school_id'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('errors.error_field',['field'=>'school_id'])
</div>

@endif
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('name','Le nom de la classe',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','name',old('name'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('errors.error_field',['field'=>'name'])
</div>
<div class="form-group">
    {!! Form::submit('Créer la classe',['class'=>'btn']) !!}
</div>
