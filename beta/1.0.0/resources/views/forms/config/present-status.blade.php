<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('present','Status',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','defaultSchoolYearBegin',null,['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : Présent']) !!}
    @include('forms.partials.base-info',['message'=>'Ceci est une valeur par defaut que vous ne pouvez pas changer.'])
</div>

<div class="form-group">
    {!! Form::submit($submit,['class'=>'btn']) !!}
</div>