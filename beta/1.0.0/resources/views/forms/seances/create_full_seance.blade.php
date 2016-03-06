<fieldset class="form-group-container">
    <legend class="form-group-container__legend">À qui s’applique cette séance</legend>
    @unless(empty($cours->toArray()))
        <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
            {!! Form::label('cour_id','Choisissez un cours',['class'=>'floating-placeholder__label']) !!}
            {!! Form::select('cour_id',$cours,isset($cour)?$cour->id:null,['class'=>'mask visuallyhidden',"data-type"=>"select"]) !!}
            @include('errors.error_field',['field'=>'cour_id'])
        </div>
    @endunless
    @unless(empty($classes->toArray()))
        @include('forms.partials.base-info--important',
        ['message'=>'Attention : si vous planifiez des séances avec des classes qui  n’ont pas encore d’élèves,
        vous ne pourrez prendre les présences qu’après avoir ajouté des élèves à cette classe.'])
        <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
            {!! Form::label('classe_id','Choisissez une classe',['class'=>'floating-placeholder__label']) !!}
            <select name="classe_id" id="classe_id" class="mask visuallyhidden" data-type="select">
                @foreach($classes as $classe)
                    <?php $selectInfoval = empty($classe->students->toArray()) ? 'Ne contient pas d’élève' : 'Contient des élèves' ?>
                    <option value="{!! $classe->id !!}"
                            data-info-select="{!! $selectInfoval !!}">{!! $classe->name !!}</option>
                @endforeach
            </select>
            @include('errors.error_field',['field'=>'classe_id'])
        </div>
    @endunless
    @unless(empty($schools->toArray()))
        <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
            {!! Form::label('school_id','Choisissez une école',['class'=>'floating-placeholder__label']) !!}
            {!! Form::select('school_id',$schools,null,['class'=>'mask visuallyhidden',"data-type"=>"select"]) !!}
            @include('errors.error_field',['field'=>'school_id'])
        </div>
    @endunless
</fieldset>
<fieldset class="form-group-container">
    <legend class="form-group-container__legend">Quand s’applique cette séance</legend>
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge link-for-input-action-container">
        {!! Form::label('from','Début de période',['class'=>'floating-placeholder__label']) !!}
        <?php $today = \Carbon\Carbon::now(); ?>
        {!! Form::input('date','from',is_null(old('from'))?$today->format('Y-m-d'):old('from'),['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex: '.$today->format('d-m-Y'),'max'=>$today->addYear()->format('Y-m-d'),'min'=>$today->format('d-m-Y')]) !!}
        @include('forms.partials.base-info',['message'=>'Entrez la date de début de votre période. À partir de quand aller vous donner ce cours … Attention, le format doit être le suivant jj-mm-aaaa. Et postérieur ou égal à aujourd’hui: '.$today->format('d-m-Y')])
        @include('errors.error_field',['field'=>'from'])
    </div>
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge link-for-input-action-container">
        {!! Form::label('to','Fin de période',['class'=>'floating-placeholder__label']) !!}
        <?php $today->addMonth() ?>
        <a href="#" class="link-for-input-action" data-date-begin="defaultSchoolYearEnd">Fin d’année</a>
        {!! Form::input('date','to',old('to'),['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex: '.$today->format('d-m-Y'),'max'=>$today->addYear()->format('Y-m-d'),'min'=>$today->format('d-m-Y') ]) !!}
        @include('forms.partials.base-info',['message'=>'Une semaine plus tard, au minimum : ' .$today->format('d-m-Y'). '. Avec le même format que la date de début.'])
        @include('errors.error_field',['field'=>'to'])
    </div>
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge link-for-input-action-container">
        {!! Form::label('day','Choisissez un jour',['class'=>'floating-placeholder__label']) !!}
        {!! Form::select('day',['0'=>'lundi','1'=>'mardi','2'=>'mercredi','3'=>'jeudi','4'=>'vendredi','5'=>'samedi','6'=>'dimanche'],old('day'),['class'=>'mask visuallyhidden',"data-type"=>"select"]) !!}
        @include('errors.error_field',['field'=>'day'])
    </div>
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge link-for-input-action-container">
        {!! Form::label('from_hour','Début de la séance de cours ( heure ) ',['class'=>'floating-placeholder__label']) !!}
        <a href="#" class="link-for-input-action" data-date-begin="defaultDayBegin">Début de journée</a>
        {!! Form::text('from_hour',old('from_hour'),['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex: 08:20']) !!}
        @include('forms.partials.base-info',['message'=>'Vous devez entrer un format d’heure qui ressemble à ceci 00:00.
                Les deux premiers chiffres correspondent aux heures et les deux chiffres suivants aux minutes.'])
        @include('errors.error_field',['field'=>'from_hour'])
    </div>
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge link-for-input-action-container">
        {!! Form::label('to_hour','Fin de la séance de cours ( heure ) ',['class'=>'floating-placeholder__label']) !!}
        <a href="#" class="link-for-input-action" data-date-begin="defaultDayEnd">Fin de journée</a>
        {!! Form::text('to_hour',old('to_hour'),['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex: 10:20']) !!}
        @include('forms.partials.base-info',['message'=>'Ici vous devez renseigner l’heure de fin de votre cours.
                Celui-ci doit respecter le même format que la date de début.'])
        @include('errors.error_field',['field'=>'to_hour'])
    </div>
</fieldset>

<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::submit($submit,['class'=>'btn']) !!}
</div>