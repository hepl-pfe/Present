<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('name','Statut',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','name',null,['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : Présent']) !!}
    @include('forms.partials.base-info',['message'=>'Entrez un nouveau statut que vous retrouverez quand vous prendrez les présences.'])
    @include('errors.error_field',['field'=>'name'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('color','Color',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','color',null,['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : #241DAA']) !!}
    @include('forms.partials.base-info',['message'=>'Entrez un couleur afin d’avoir un repère visuel lors de la prise des présences et dans vos graphiques'])
    @include('errors.error_field',['field'=>'color'])
</div>
<div class="form-group">
    {!! Form::submit($submit,['class'=>'btn']) !!}
</div>