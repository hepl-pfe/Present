<?php $schools=Auth::user()->schools ?>
<h2 class="box-header">Se lier à une école</h2>
<ul class="box">
    <li class="box__item">
        {!! link_to_action('Www\SchoolController@create','Créer une école',[],['class'=>'btn']) !!}
    </li>
    @foreach($schools as $school)
        <li>{!! link_to_action('Www\UserController@addUserToSchool','Demande d’adhésion à : '.$school->name,['id'=>$school->id],['class'=>'']) !!}</li>
    @endforeach
</ul>