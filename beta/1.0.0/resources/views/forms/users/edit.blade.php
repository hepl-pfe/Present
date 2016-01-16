<div class="form-group user_avatar-container">
    <label for="avatar">
        <span class="profile-avatar__callout">
            <svg class="svg--avatar--callout">
                <use xlink:href="#shape-callout-avatar"></use>
            </svg>
        </span>
        <span class="profile-avatar__placeholder {{ empty($user->avatar)?'':'avatar--success' }}"><img id="user-avatar" alt="" src="{{ empty($user->avatar)?'/':'http://localhost:8888/images/'.$user->avatar }}" /></span>
    </label>
    {!! Form::input('file','avatar',null,['class'=>'btn btn--small profile-avatar__action','id'=>'avatar']) !!}
    @include('errors.error_field--file',['field'=>'avatar'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('first_name','Votre prénom',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','first_name',null,['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : Jane','autofocus']) !!}
    @include('errors.error_field',['field'=>'first_name'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('last_name','Votre nom de famille',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','last_name',null,['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : Doe']) !!}
    @include('errors.error_field',['field'=>'last_name'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('email','Votre adresse email',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('email','email',null,['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : jane.doe@domaine.com']) !!}
    @include('forms.partials.base-info',['message'=>'C’est avec cette adresse mail ci que vous devrez vous identifier'])
    @include('errors.error_field',['field'=>'email'])
</div>
<div class="form-group">
    {!! Form::submit($submit,['class'=>'btn']) !!}
</div>