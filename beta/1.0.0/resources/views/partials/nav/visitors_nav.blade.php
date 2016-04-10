<div class="layout header-fix" role="navigation">
    <div class="layout__item u-6/12-desk u-6/12-lap u-12/12-palm">
        <a class="header-fix__item svg-container" href="{!! URL::action('Www\PageController@dashboard') !!}">
            <svg class="svg-basic svg-blue svg--visitor-nav">
                <use xlink:href="#shape-logo"></use>
            </svg>
            Présent, l’outil de gestion de présences</a>
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