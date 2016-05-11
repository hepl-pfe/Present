<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    <label for="note" class="floating-placeholder__label">La note @include('forms.partials.required')</label>
    {!! Form::textarea('note',old('note'),['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : Une jolie petite note concernant l’élève '.$student->fullname,'id'=>'note']) !!}
    @include('errors.error_field',['field'=>'note'])
</div>
@include('forms.partials.required--message')
{!! Form::submit('Ajouter la note',['class'=>'btn']) !!}
