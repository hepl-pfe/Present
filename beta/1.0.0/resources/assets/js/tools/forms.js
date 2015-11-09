(function () {
    "use strict";
    var i,
        oLinkPassword = document.getElementById( 'oLinkPassword' ),
        oPasswordInput = document.getElementsByClassName( 'oPasswordInput' );
    if ( oLinkPassword !== null ) {
        oLinkPassword.addEventListener( 'click', function () {
            show( oPasswordInput, oLinkPassword );
        }, false );
    }
    function show( elements, link ) {
        for ( i = 0; i < elements.length; i++ ) {
            elements[ i ].type = elements[ i ].type == 'password' ? 'text' : 'password';
        }
        link.childNodes[ 0 ].nodeValue = (elements[ 0 ].type == 'password' ? 'Montrer ' : 'Cacher ') + 'le mot de passe';
    }
})();