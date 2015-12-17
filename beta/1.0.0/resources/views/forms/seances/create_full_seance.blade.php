<fieldset class="form-group-container">
    <legend class="form-group-container__legend">À qui s’applique cette séance</legend>
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge form-group--select">
        {!! Form::label('cour_id','Choisissez un cours',['class'=>'floating-placeholder__label']) !!}
        {!! Form::select('cour_id',$cours,isset($cour)?$cour->id:null,['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
        @include('errors.error_field',['field'=>'cour_id'])
    </div>
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge form-group--select">
        {!! Form::label('classe_id','Choisissez une classe',['class'=>'floating-placeholder__label']) !!}
        {!! Form::select('classe_id',$class,old('classe_id'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
        @include('errors.error_field',['field'=>'classe_id'])
    </div>
    @unless(empty(Auth::user()->schools->toArray()))
        <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge form-group--select">
            {!! Form::label('school_id','Choisissez une école',['class'=>'floating-placeholder__label']) !!}
            {!! Form::select('school_id',$schools,null,['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
            @include('errors.error_field',['field'=>'school_id'])
        </div>
    @endunless
</fieldset>
<fieldset class="form-group-container">
    <legend class="form-group-container__legend">Quand s’applique cette séance</legend>
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
        {!! Form::label('from','Début de période',['class'=>'floating-placeholder__label']) !!}
        {!! Form::text('from',old('from'),['class'=>'datepicker floating-placeholder__input--huge floating-placeholder__input']) !!}
        @include('errors.error_field',['field'=>'from'])
    </div>
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
        {!! Form::label('to','Fin de période',['class'=>'floating-placeholder__label']) !!}
        {!! Form::text('to',old('to'),['class'=>'datepicker floating-placeholder__input--huge floating-placeholder__input']) !!}
        @include('errors.error_field',['field'=>'to'])
    </div>
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge form-group--select">
        {!! Form::label('day','Choisissez un jour',['class'=>'floating-placeholder__label']) !!}
        {!! Form::select('day',['0'=>'lundi','1'=>'mardi','2'=>'mercredi','3'=>'jeudi','4'=>'vendredi','5'=>'samedi','6'=>'dimanche'],old('day'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
        @include('errors.error_field',['field'=>'day'])
    </div>
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
        {!! Form::label('from_hour','Début de la séance de cours ( heure ) ',['class'=>'floating-placeholder__label']) !!}
        {!! Form::text('from_hour',old('from_hour'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
        <div class="form-group__info-box">
            <p class="form-group__info-box__text">Vous devez entrer un format d’heure qui ressemble à ceci 00:00.
                Les deux premiers chiffres correspondent aux heures et les deux chiffres suivants aux minutes.
            </p>
        </div>
        @include('errors.error_field',['field'=>'from_hour'])
    </div>
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
        {!! Form::label('to_hour','Fin de la séance de cours ( heure ) ',['class'=>'floating-placeholder__label']) !!}
        {!! Form::text('to_hour',old('to_hour'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
        <div class="form-group__info-box">
            <p class="form-group__info-box__text">Ici vous devez renseigner l’heure de fin de votre cours.
                Celui-ci doit respecter le même format que la date de début.
            </p>
        </div>
        @include('errors.error_field',['field'=>'to_hour'])
    </div>
</fieldset>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::submit($submit,['class'=>'btn']) !!}
</div>