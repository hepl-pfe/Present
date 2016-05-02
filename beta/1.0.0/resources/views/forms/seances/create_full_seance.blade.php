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
        <?php $today = \Carbon\Carbon::now(); ?>
    <div class='input-group date floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge link-for-input-action-container' style="position:relative;">
        {!! Form::label('from','Début de période',['class'=>'floating-placeholder__label']) !!}
        {!! Form::input('text','from',is_null(old('from'))?$today->format('Y-m-d'):old('from'),['class'=>'floating-placeholder__input--huge floating-placeholder__input dateType-1','placeholder'=>'ex: '.$today->format('d-m-Y'),'max'=>$today->addYear()->format('Y-m-d'),'min'=>$today->format('d-m-Y')]) !!}
            {{--<input type='text' class=""/>--}}
            <span class="input-group-addon form-group__svg form-group__svg--white">
                 <svg class="svg-basic svg--blue">
                     <use xlink:href="#shape-calendar"></use>
                 </svg>
            </span>
        @include('errors.error_field',['field'=>'from'])
    </div>
    <div class='input-group date floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge link-for-input-action-container ' style="position:relative;">
        {!! Form::label('to','Date de fin',['class'=>'floating-placeholder__label']) !!}
        {!! Form::input('text','to',is_null(old('to'))?$today->format('Y-m-d'):old('to'),['class'=>'floating-placeholder__input--huge floating-placeholder__input dateType-1','placeholder'=>'ex: '.$today->format('d-m-Y'),'max'=>$today->addYear()->format('Y-m-d'),'min'=>$today->format('d-m-Y')]) !!}
            {{--<input type='text' class=""/>--}}
            <span class="input-group-addon form-group__svg form-group__svg--white">
                 <svg class="svg-basic svg--blue">
                     <use xlink:href="#shape-calendar"></use>
                 </svg>
            </span>
        @include('errors.error_field',['field'=>'to'])
    </div>
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge link-for-input-action-container">
        {!! Form::label('day','Choisissez un jour',['class'=>'floating-placeholder__label']) !!}
        {!! Form::select('day',['0'=>'lundi','1'=>'mardi','2'=>'mercredi','3'=>'jeudi','4'=>'vendredi','5'=>'samedi','6'=>'dimanche'],old('day'),['class'=>'mask visuallyhidden',"data-type"=>"select"]) !!}
        @include('errors.error_field',['field'=>'day'])
    </div>

    <div class='input-group date floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge link-for-input-action-container' style="position:relative;">
        {!! Form::label('from_hour','Date de fin',['class'=>'floating-placeholder__label']) !!}
        {!! Form::input('text','from_hour',is_null(old('from_hour'))?$today->format('Y-m-d'):old('from_hour'),['class'=>'floating-placeholder__input--huge floating-placeholder__input hourType-1','placeholder'=>'ex: '.$today->format('d-m-Y'),'max'=>$today->addYear()->format('Y-m-d'),'min'=>$today->format('d-m-Y')]) !!}
        {{--<input type='text' class=""/>--}}
        <span class="input-group-addon form-group__svg form-group__svg--white">
                 <svg class="svg-basic svg--blue">
                     <use xlink:href="#shape-clock"></use>
                 </svg>
            </span>
        @include('errors.error_field',['field'=>'from_hour'])
    </div>
    <div class='input-group date floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge link-for-input-action-container' style="position:relative;">
        {!! Form::label('to_hour','Date de fin',['class'=>'floating-placeholder__label']) !!}
        {!! Form::input('text','to_hour',is_null(old('to_hour'))?$today->format('Y-m-d'):old('to_hour'),['class'=>'floating-placeholder__input--huge floating-placeholder__input hourType-1','placeholder'=>'ex: '.$today->format('d-m-Y'),'max'=>$today->addYear()->format('Y-m-d'),'min'=>$today->format('d-m-Y')]) !!}
        {{--<input type='text' class=""/>--}}
        <span class="input-group-addon form-group__svg form-group__svg--white">
                 <svg class="svg-basic svg--blue">
                     <use xlink:href="#shape-clock"></use>
                 </svg>
            </span>
        @include('errors.error_field',['field'=>'to_hour'])
    </div>
</fieldset>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::submit($submit,['class'=>'btn']) !!}
</div>