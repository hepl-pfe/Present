<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge add_student_to_class">
    {!!  Html::linkAction('Www\FileController@getCSVExemple','Télécharger un fichier (.CSV) d’exemple',[],['class'=>'csv-fload-file']) !!}
    <label for="student_list" class="floating-placeholder__label">Sélectionnez le fichier (.CSV) contenant vos élèves @include('forms.partials.required')</label>
    {!! Form::input('file','student_list',old('student_list'),['class'=>'floating-placeholder__input--huge floating-placeholder__input','id'=>'student_list']) !!}
    @include('errors.error_field',['field'=>'student_list'])
</div>
@include('forms.partials.required--message')
<div class="form-group">
    {!! Form::submit('Importer les élèves',['class'=>'btn']) !!}
</div>
