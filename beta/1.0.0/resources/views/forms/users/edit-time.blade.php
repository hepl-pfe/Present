<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('defaultSchoolYearBegin','Début de l’année scolaire',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','defaultSchoolYearBegin',null,['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : 2015-09-09']) !!}
    @include('forms.partials.base-info',['message'=>'Indiquez ici le début de l’année scolaire, pour vous. Cette information serra la date de début pour des cours qui commencent en début d’année. Le format attendu est : aaaa-mm-jj'])
    @include('errors.error_field',['field'=>'defaultSchoolYearBegin'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('defaultSchoolYearEnd','Fin de l’année scolaire',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','defaultSchoolYearEnd',null,['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : 2016-06-01']) !!}
    @include('forms.partials.base-info',['message'=>'De même pour la fin d’année'])
    @include('errors.error_field',['field'=>'defaultSchoolYearEnd'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('defaultCoursDuration','Durée d’un cours par défaut',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','defaultCoursDuration',null,['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : 50']) !!}
    @include('forms.partials.base-info',['message'=>'Indiquez la durée par défaut d’un cours en minutes. Le format attendu est : hh:mm'])
    @include('errors.error_field',['field'=>'defaultCoursDuration'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('defaultDayBegin','Début de journée par défaut',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','defaultDayBegin',null,['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : 08:20']) !!}
    @include('forms.partials.base-info',['message'=>'Indiquez ici l’heure de début d’une journée, pour vous. Cette information sera l’heure de début pour des cours qui commencent en début de journée. Le format attendu est : aaaa-mm-jj'])
    @include('errors.error_field',['field'=>'defaultDayBegin'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('defaultDayEnd','Début de journée par défaut',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','defaultDayEnd',null,['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : 16:20']) !!}
    @include('forms.partials.base-info',['message'=>'De même pour la fin de journée'])
    @include('errors.error_field',['field'=>'defaultDayEnd'])
</div>
<div class="form-group">
    {!! Form::submit($submit,['class'=>'btn']) !!}
</div>