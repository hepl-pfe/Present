@if(empty(Auth::user()->students->toArray()))
    <p class="alert-neutre message-box">Oh vous ne semblez pas encore d’avoir des élèves. Vous pouvez charger un fichier <a href="#">.csv</a> pour
        ajouter des élèves.</p>
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge add_student_to_class">
        {!! Form::label('csv','Charger la liste de vos élèves',['class'=>'floating-placeholder__label']) !!}
        {!! Form::input('file','csv',old('csv'),['class'=>'floating-placeholder__input--huge floating-placeholder__input']) !!}
        @include('errors.error_field',['field'=>'csv'])
    </div>
@else
    Lister les élèves
@endif
<div class="form-group">
    {!! Form::submit($submit,['class'=>'btn']) !!}
</div>

