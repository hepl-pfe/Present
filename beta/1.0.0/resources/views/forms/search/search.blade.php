{!! Form::label('search','Rechercher',['class'=>'visuallyhidden']) !!}
{!! Form::text('search','',['class'=>'input-search-header','placeholder'=>'ex : un élève']) !!}
{!! Form::submit($submit,['class'=>'btn btn--small submit--search']) !!}