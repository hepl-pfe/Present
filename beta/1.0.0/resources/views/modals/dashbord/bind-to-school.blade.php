<?php $schools=\App\School::all() ?>
<h2 class="box-header">Créer une école</h2>
<ul class="box">
    <li class="box__item">
        {!! link_to_action('Www\SchoolController@create','Créer une école',[],['class'=>'btn btn--small']) !!}
    </li>
    @foreach($schools as $school)
        <li>{!! link_to_action('Www\UserController@addUserToSchool','Demande d’adhésion à : '.$school->name,['id'=>$school->id],['class'=>'']) !!}</li>
    @endforeach
</ul>