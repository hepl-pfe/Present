<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::select('secteur_note',['Note relative aux cours'=>'notes_cours','Notes relatives à l’année'],['selected'=>'notes_cours'],['class'=>'simple-select']) !!}
    {!! Form::label('secteur_note','Ajouter une note',['class'=>'simple-label']) !!}
    @include('errors.error_field',['field'=>'secteur_note'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
        {!! Form::textarea('note_text','',['class'=>'input form-group--large__input']) !!}
        {!! Form::label('note_text','',['class'=>'label-paceholder']) !!}
        @include('errors.error_field',['field'=>'note_text'])
        {!! Form::submit('Ajouter la note',['class'=>'form-group--large__submit']) !!}
</div>

