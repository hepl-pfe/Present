<p class="alert-neutre message-box">Ici Vous pouvez ajouter des élèves à la classe, <i>{!! $classe->name !!}</i>. Il suffit d'entrez le nom d’un élève.</p>
@unless(empty($students->toArray()))
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge form-group--select">
    <label for="{{$classe->name}}" class="floating-placeholder__label">Sélectionnez vos élèves @include('forms.partials.required')</label>
    {!! Form::select('students_id[]',$students,$selected_student,['class'=>'chosen-select floating-placeholder__input--huge floating-placeholder__input','multiple','id'=>$classe->name]) !!}
    @include('errors.error_field',['field'=>'students_id'])
</div>
@endunless
@include('forms.partials.required--message')
<div class="form-group">
    {!! Form::submit($submit,['class'=>'btn']) !!}
</div>