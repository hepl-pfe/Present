<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('csv','Charger la liste de vos élèves',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('file','csv',old('csv'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
    @include('forms.partials.base-info',['message'=>'C’est ici que vous pouvez charger votre fichier avec une l’extension
    &laquo;.csv.&raquo ce ficher peut être obtenu à partir d’un fichier Excel il vous suffit d’enregistrer sous &laquo;.csv.&raquo.'])
    @include('errors.error_field',['field'=>'csv'])
</div>
<div class="form-group">
    {!! Form::submit('Importer les élèves',['class'=>'btn']) !!}
</div>
