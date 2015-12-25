<?php $placeholder= $cours->total()==0?'un cours':$cours[0]->name;  ?>
{!! Form::label('search_classe','Rechercher une classe',['class'=>'visuallyhidden']) !!}
{!! Form::input('search','search_classe','',['class'=>'box__search','placeholder'=>'ex : '.$placeholder]) !!}