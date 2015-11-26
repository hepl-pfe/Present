<?php $schools= Auth::user()->schools ?>
<div class="box-header beta">{!! Html::linkAction('Www\ClassController@index','Les classes',[],['class'=>'']) !!} {!! link_to_action('Www\SchoolController@create','Créer une école',[],['class'=>'btn btn--add btn--small btn--soft']) !!}</div>
<ul class="box">
    @foreach($schools as $school)
        <li>{!! link_to_action('Www\SchoolController@show',$school->name,['slug'=>$school->slug],['class'=>'']) !!}</li>
    @endforeach
</ul>