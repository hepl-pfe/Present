<div class="layout header-fix" role="navigation">
    <div class="layout__item u-6/12-desk u-6/12-lap u-12/12-palm">
        <a class="header-fix__item" href="#">Présent</a>
    </div>
    <div class="layout__item u-2/12-desk u-2/12-lap u-12/12-palm">
        {!! Html::linkAction('Auth\AuthController@getRegister','S’inscrire',[],['class'=>'header-fix__item']) !!}
    </div>
    <div class="layout__item u-2/12-desk u-2/12-lap u-12/12-palm">
        {!! Html::linkAction('Auth\AuthController@getLogin','S’identifier',[],['class'=>'header-fix__item']) !!}
    </div>
    <div class="layout__item u-2/12-desk u-2/12-lap u-12/12-palm">
        {!! Html::linkAction('Auth\PasswordController@getEmail','Mot de passe oublié',[],['class'=>'header-fix__item']) !!}
    </div>
</div>