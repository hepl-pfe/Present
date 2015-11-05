<div class="form-group">
    {!! Form::select('secteur_note',['Note relative aux cours'=>'notes_cours','Notes relatives à l’année'],['selected'=>'notes_cours'],['class'=>'simple-select']) !!}
    {!! Form::label('secteur_note','Ajouter une note',['class'=>'simple-label']) !!}
</div>
<div class="form-group">
    {!! Form::textarea('note_text','',['class'=>'input']) !!}
    {!! Form::label('note_text','',['class'=>'label-paceholder']) !!}
</div>
<div class="form-group">
    {!! Form::text('node','',['class'=>'input']) !!}
    {!! Form::label('node','',['class'=>'label-paceholder']) !!}
</div>
<div class="form-group">
    {!! Form::submit('Ajouter la note',['class'=>'']) !!}
</div>