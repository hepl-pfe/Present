<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('day','Sélectionner un jour',['class'=>'floating-placeholder__label']) !!}
    {!! Form::select('day',['lundi'=>'lundi','mardi'=>'mardi','mercredi'=>'mercredi','jeudi'=>'jeudi','vendredi'=>'vendredi'],['class'=>'mask visuallyhidden',"data-type"=>"select"]) !!}
    @include('errors.error_field',['field'=>'class'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('horaire_format','Sélectionner une plage horaire',['class'=>'floating-placeholder__label']) !!}
    {!! Form::select('horaire_format',['1'=>'De 08:30 à 09:20','2'=>'De 09:20 à 10:10'],['class'=>'mask visuallyhidden',"data-type"=>"select"]) !!}
    @include('errors.error_field',['field'=>'class'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('classe','Sélectionner une classe',['class'=>'floating-placeholder__label']) !!}
    {!! Form::select('classe',$classes,['class'=>'mask visuallyhidden',"data-type"=>"select"]) !!}
    @include('errors.error_field',['field'=>'class'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('cours','Sélectionner votre cours',['class'=>'floating-placeholder__label']) !!}
    {!! Form::select('cours',$cours,['class'=>'mask visuallyhidden',"data-type"=>"select"]) !!}
    @include('errors.error_field',['field'=>'class'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::submit('Créer l’horaire',['class'=>'btn']) !!}
</div>
