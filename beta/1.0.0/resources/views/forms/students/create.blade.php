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
    {!! Form::label('first_name','Prénom',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','first_name',old('first_name'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('errors.error_field',['field'=>'first_name'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('last_name','Nom de famille',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','last_name',old('last_name'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('errors.error_field',['field'=>'last_name'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('email_parent_1','Email 1 du parent',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('email','email_parent_1',old('email_parent_1'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('errors.error_field',['field'=>'email_parent_1'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('email_parent_2','Email 2 du parent',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('email','email_parent_2',old('email_parent_2'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('errors.error_field',['field'=>'email_parent_2'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('email_eleve_1','Email 1 de l’élève',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('email','email_eleve_1',old('email_eleve_1'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('errors.error_field',['field'=>'email_eleve_1'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('email_eleve_2','Email 2 de l’élève',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('email','email_eleve_2',old('email_eleve_2'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('errors.error_field',['field'=>'email_eleve_2'])

</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('classe_id','La classe',['class'=>'floating-placeholder__label']) !!}
    {!! Form::select('classe_id',$classes,['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('errors.error_field',['field'=>'class'])
</div>
<div class="form-group">
    {!! Form::submit('Ajouter l’élève',['class'=>'btn']) !!}
</div>
