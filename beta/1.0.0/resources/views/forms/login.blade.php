
        <fieldset>
            <legend>Vos coordonnées</legend>
            mmlklk
        </fieldset>
        <fieldset>
            <legend>Les cordonnées de l’institition</legend>
            {!! Form::label('institution_type','Le type de l’institition') !!}
            {!! Form::select('institution_type',['asbl'=>'A.S.B.L','ecole_maternelle'=>'École maternelle','ecole_secondaire'=>'École seconfaire'],null,['class'=>'']) !!}
            {!! Form::label('institution_name', 'Le nom complet de votre école') !!}
            {!! Form::text('institution_name','',['class'=>'']) !!}
        </fieldset>
        {!! Form::submit('Enregistrer Votre ecoles',['class'=>'']) !!}


