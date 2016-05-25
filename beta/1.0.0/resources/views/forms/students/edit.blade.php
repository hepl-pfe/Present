<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    <label for="edit-student-first_name-{!! $student->id !!}" class="floating-placeholder__label">Prénom @include('forms.partials.required')</label>
    {!! Form::input('text','first_name',null,['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : Valérie','id'=>'edit-student-first_name-'.$student->id]) !!}
    @include('errors.error_field',['field'=>'first_name'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    <label for="edit-student-last_name-{!! $student->id !!}" class="floating-placeholder__label">Nom de famille @include('forms.partials.required')</label>
    {!! Form::input('text','last_name',null,['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : Dumont','id'=>'edit-student-last_name-'.$student->id]) !!}
    @include('errors.error_field',['field'=>'last_name'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    <label for="edit-student-email-{!! $student->id !!}" class="floating-placeholder__label">Email de l’élève @include('forms.partials.required')</label>
    {!! Form::input('email','email',null,['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : velérie.dumont@domaine.com','id'=>'edit-student-email-'.$student->id]) !!}
    @include('errors.error_field',['field'=>'email'])
</div>
<div class="form-group">
    {!! Form::submit($submit,['class'=>'btn']) !!}
</div>
