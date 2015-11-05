<div class="form-group">
    {!! Form::label('secteur_note','Ajouter une note',['class'=>'simple-label']) !!}
    {!! Form::select('secteur_note',['Note relative aux cours'=>'notes_cours','Notes relatives à l’année'],['selected'=>'notes_cours'],['class'=>'simple-select']) !!}
</div>
<div class="form-group">
    {!! Form::label('note_text','',['class'=>'']) !!}
    {!! Form::textarea('note_text','',['class'=>'']) !!}
    {!! Form::text('n','',['class'=>'']) !!}
</div>
<div class="form-group">
    {!! Form::submit('Ajouter la note',['class'=>'']) !!}
</div>
