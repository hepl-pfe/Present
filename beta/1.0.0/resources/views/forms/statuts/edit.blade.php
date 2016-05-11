<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    <label for="name" class="floating-placeholder__label">Le nom du statut @include('forms.partials.required')</label>
    {!! Form::input('text','name',null,['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : Présent','id'=>'name']) !!}
    @include('forms.partials.base-info',['message'=>'Entrez un nouveau statut que vous retrouverez quand vous prendrez les présences.'])
    @include('errors.error_field',['field'=>'name'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    <label for="color" class="floating-placeholder__label">Une couleurs @include('forms.partials.required')</label>
    {!! Form::input('text','color',null,['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : #241DAA','id'=>'color']) !!}
    @include('forms.partials.base-info',['message'=>'Entrez une couleur afin d’avoir un repère visuel lors de la prise des présences et dans vos graphiques'])
    @include('errors.error_field',['field'=>'color'])
</div>
@include('forms.partials.required--message')
<div class="form-group">
    {!! Form::submit($submit,['class'=>'btn btn--small']) !!}
</div>