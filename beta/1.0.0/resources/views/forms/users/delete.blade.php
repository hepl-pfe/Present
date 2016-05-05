@include('forms.partials.base-info--important',['message'=>'Afin de supprimez votre compte entre le mot : <i>SUPPRIMER</i>'])
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('confirm','Tapez de toute lettre, SUPPRIMER',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','confirm',null,['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : Jane','autofocus']) !!}
    @include('errors.error_field',['field'=>'confirm'])
</div>
<div class="form-group">
    {!! Form::submit($submit,['class'=>'btn']) !!}
</div>