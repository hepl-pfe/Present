<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('first_name','Prénom',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','first_name',old('first_name'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('last_name','Nom de famille',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','last_name',old('last_name'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('email_parent_1','Email du parent 1',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('email','email_parent_1',old('email_parent_1'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('email_parent_2','Email 2 de l’élève',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('email','email_parent_2',old('email_parent_2'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('email_eleve_1','Email 2 de l’élève',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('email','email_eleve_1',old('email_eleve_1'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('email_eleve_2','Email 2 de l’élève',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('email','email_eleve_2',old('email_eleve_2'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('last_name','La classe',['class'=>'floating-placeholder__label']) !!}
    {!! Form::select('class',['2F'=>'2F'],['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
</div>
<div class="form-group">
    {!! Form::submit('Ajouter l’élève',['class'=>'btn']) !!}
</div>
