<div class="form-group">
    {!! Form::select('secteur_note',['Note relative aux cours'=>'notes_cours','Notes relatives à l’année'],['selected'=>'notes_cours'],['class'=>'simple-select']) !!}
    {!! Form::label('secteur_note','Ajouter une note',['class'=>'simple-label']) !!}
</div>
<div class="form-group form-group--large">
        {!! Form::textarea('note_text','',['class'=>'input form-group--large__input']) !!}
        {!! Form::label('note_text','',['class'=>'label-paceholder']) !!}
        {!! Form::submit('Ajouter la note',['class'=>'form-group--large__submit']) !!}
</div>

