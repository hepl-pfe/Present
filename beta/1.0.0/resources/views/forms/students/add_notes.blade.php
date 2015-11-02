{!! Form::label('secteur_note','',['class'=>'']) !!}
{!! Form::select('secteur_note',['Note relative aux cours'=>'notes_cours','Notes relatives à l’année'],['selected'=>'notes_cours'],['class'=>'']) !!}
{!! Form::label('note_text','',['class'=>'']) !!}
{!! Form::textarea('note_text','',['class'=>'']) !!}
{!! Form::submit('Ajouter la note',['class'=>'']) !!}