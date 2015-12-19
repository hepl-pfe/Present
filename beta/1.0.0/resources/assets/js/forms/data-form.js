jQuery( function ( $ ) {
    $( "[data-form]" ).click( function ( e ) {
        e.preventDefault();
        $( '.' + this.getAttribute( 'data-form' ) ).toggleClass( 'form--show' );
        e.stopPropagation();
    } );
    $( document ).click( function () {
        fRemoveClass();
    } );
    $( '.form-hidde form' ).click( function ( e ) {
        e.stopPropagation();
    } );

    jQuery( document ).keyup( function ( e ) {
        if ( e.keyCode == 27 ) {
            fRemoveClass();
        }
    } );

    var fRemoveClass = function () {
        $( '.form--show' ).removeClass( 'form--show' );
    }

} );

