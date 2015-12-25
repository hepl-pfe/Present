<?php $placeholder= $students->total()==0?'un élève':$students[0]->fullname;  ?>
{!! Form::label('search_classe','Rechercher une classe',['class'=>'visuallyhidden']) !!}
{!! Form::input('search','search_classe','',['class'=>'box__search','placeholder'=>'ex : '.$placeholder ]) !!}