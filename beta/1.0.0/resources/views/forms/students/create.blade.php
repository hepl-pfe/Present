<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    <label for="create-student-first_name" class="floating-placeholder__label">Prénom @include('forms.partials.required')</label>
    {!! Form::input('text','first_name',old('first_name'),['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : Valérie','id'=>'create-student-first_name']) !!}
    @include('errors.error_field',['field'=>'first_name'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    <label for="create-student-last_name" class="floating-placeholder__label">Nom de famille @include('forms.partials.required')</label>
    {!! Form::input('text','last_name',old('last_name'),['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : Dumont','id'=>'create-student-last_name']) !!}
    @include('errors.error_field',['field'=>'last_name'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    <label for="create-student-email" class="floating-placeholder__label">Email de l’élève @include('forms.partials.required')</label>
    {!! Form::input('email','email',old('email'),['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : velérie.dumont@domaine.com','id'=>'create-student-email']) !!}
    @include('errors.error_field',['field'=>'email'])
</div>
@unless(empty(Auth::user()->schools->toArray()))
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
        <label for="" class="floating-placeholder__label">Le nom des école @include('forms.partials.required')</label>
        {!! Form::select('school_id',$schools,old('school_id'),['class'=>'mask visuallyhidden',"data-type"=>"select"]) !!}
        @include('errors.error_field',['field'=>'school_id'])
    </div>
@endunless
@unless(empty(Auth::user()->classes->toArray()))
    <div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
        <label class="floating-placeholder__label">Le nom des classes @include('forms.partials.required')</label>
        {!! Form::select('classes_id[]',$classes,old('classes_id'),['class'=>'mask visuallyhidden',"data-type"=>"select"]) !!}
        @include('errors.error_field',['field'=>'classes_id'])
    </div>
@endunless
@include('forms.partials.required--message')
<div class="form-group">
    {!! Form::submit('créer l’élève',['class'=>'btn']) !!}
</div>
