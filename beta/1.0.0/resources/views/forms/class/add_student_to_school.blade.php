<p class="alert-neutre message-box">Ici Vous pouvez ajouter des élèves à la classe, <i>{!! $classe->name !!}</i>. Il suffit d'entrez le nom d’un élève.</p>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge form-group--select">
    {!! Form::label('students_id','Sélectionnez vos élèves',['class'=>'floating-placeholder__label']) !!}
    {!! Form::select('students_id[]',$students,$selected_student,['class'=>'chosen-select floating-placeholder__input--huge floating-placeholder__input','multiple']) !!}
    @include('errors.error_field',['field'=>'students_id'])
</div>
<div class="form-group">
    {!! Form::submit($submit,['class'=>'btn']) !!}
</div>