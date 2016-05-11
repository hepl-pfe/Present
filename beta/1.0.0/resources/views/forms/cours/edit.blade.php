<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    <label for="edit-cours-{!! $cour->name !!}" class="floating-placeholder__label">Le nom du cours @include('forms.partials.required')</label>
    {!! Form::input('text','name',null,['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : Français','id'=>'edit-cours-'.$cour->name]) !!}
    @include('errors.error_field',['field'=>'name'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    <label for="edit-cours-description-{!! $cour->name !!}" class="floating-placeholder__label">Une description du cours</label>
    {!! Form::textarea('description',null,['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : Un simple petit texte qui décrit le cours','id'=>'edit-cours-description-'.$cour->name]) !!}
    @include('errors.error_field',['field'=>'description'])
</div>
@include('forms.partials.required--message')
<div class="form-group">
    {!! Form::submit($submit,['class'=>'btn']) !!}
</div>
