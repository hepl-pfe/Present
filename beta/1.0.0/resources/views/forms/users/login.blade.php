{!! Form::open(['url' => '/']) !!}
    {!! Form::text('username','Votre nom de famille') !!}
    {!! Form::text('username',old('surname'),['class'=>'']) !!}
    {!! Form::label('institution_name', 'Le nom complet de votre école') !!}
    {!! Form::text('institution_name','',['class'=>'']) !!}
    {!! Form::label('remember','Se souvenir de moi',['class'=>'']) !!}
    {!! Form::checkbox('remember','',true,['class'=>'']) !!}
{!! Form::submit('S’identifier',['class'=>'']) !!}
{!! Form::close() !!}