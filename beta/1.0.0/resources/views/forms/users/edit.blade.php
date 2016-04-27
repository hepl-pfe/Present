<div class="form-group user_avatar-container">
    <label for="avatar">
        <span class="profile-avatar__callout">
            <svg class="svg--avatar--callout">
                <use xlink:href="#shape-callout-avatar"></use>
            </svg>
        </span>
        <span class="profile-avatar__placeholder {{ empty($user->avatar)?'':'avatar--success' }}"><img id="user-avatar" alt="" src="{{ empty($user->avatar)?'/':'/image-origine/'.$user->avatar }}" /></span>
    </label>
    <p class="profile-avatar__placeholder__meta">Le format de l'image doit être .png  ou .jpg ,et elle doit être d'au moins 100 pixels par 100 pixels</p>
    {!! Form::input('file','avatar',null,['class'=>'block','id'=>'avatar']) !!}
    @include('errors.error_field--file',['field'=>'avatar'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('name','Votre nom',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('text','name',null,['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : Jane','autofocus']) !!}
    @include('errors.error_field',['field'=>'name'])
</div>
<div class="floating-placeholder form-group floating-placeholder-float--blue floating-placeholder-float--huge">
    {!! Form::label('email','Votre adresse email',['class'=>'floating-placeholder__label']) !!}
    {!! Form::input('email','email',null,['class'=>'floating-placeholder__input--huge floating-placeholder__input','placeholder'=>'ex : jane.doe@domaine.com']) !!}
    <div class="form-group__svg form-group__svg--no" id="" data-toggle="tooltip" title="<?php echo($user->verified?'Votre adresse mail est validé':'Votre adresse mail n’est pas encore validé'); ?>">
        <svg class="svg-basic <?php echo($user->verified?'svg--success':'svg--alert'); ?>">
            <use xlink:href="#shape-<?php echo($user->verified?'checked':'not'); ?>"></use>
        </svg>
    </div>
    @unless($user->verified)
        {!! Html::linkAction('Www\UserController@getVerificationMail','Renvoyer un mail de confirmation') !!}
    @endunless
    @include('forms.partials.base-info',['message'=>'C’est avec cette adresse mail ci que vous devrez vous identifier'])
    @include('errors.error_field',['field'=>'email'])
</div>
<div class="form-group">
    {!! Form::submit($submit,['class'=>'btn']) !!}
</div>