@include('forms.partials.base-info--important',['message'=>'Importez vos élèves depuis un ficher &laquo;.csv&raquo;'])
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('student-lits-csv','Charger la liste de vos élèves',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('file','student-lits-csv',old('student-lits-csv'),['class'=>'floating-placeholder__input--huge floating-placeholder__input','id'=>'student-list']) !!}
    @include('forms.partials.base-info',['message'=>'C’est ici que vous pouvez charger votre fichier avec une l’extension
    &laquo;.csv.&raquo ce ficher peut être obtenu à partir d’un fichier Excel il vous suffit d’enregistrer sous &laquo;.csv.&raquo.'])
    @include('errors.error_field',['field'=>'student-lits-csv'])
</div>
<div class="form-group">
    {!! Form::submit('Importer les élèves',['class'=>'btn']) !!}
</div>
