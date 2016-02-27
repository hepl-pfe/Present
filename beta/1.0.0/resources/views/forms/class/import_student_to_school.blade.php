<p class="alert-neutre message-box">Oh vous semblez ne pas encore avoir d’élèves.
    Vous pouvez charger un fichier .csv pour ajouter ces élèves et les ajouter à la classe {!! $classe->name !!}</i>.
    Si vous désirez importer des élèves sans les lier à la classe {!! $classe->name !!} vous pouvez le faire depuis ce {!! Html::linkAction('Www\StudentController@getImportStudentsList','ce formulaire-ci.',['title'=>'Renvoie vers un formulaire qui permet d’importer des élèves']) !!}</p>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge add_student_to_class">
    {!! Form::label('student_list','Charger la liste de vos élèves',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('file','student_list',old('student_list'),['class'=>'floating-placeholder__input--huge floating-placeholder__input','id'=>'student_list']) !!}
    @include('errors.error_field',['field'=>'student_list'])
</div>
<div class="form-group">
    {!! Form::submit($submit,['class'=>'btn']) !!}
</div>

