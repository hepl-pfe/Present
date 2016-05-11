jQuery( function ( $ ) {
    var url = '';
    $( "[data-form]" ).click( function ( e ) {
        e.preventDefault();
        url = this.getAttribute( 'data-form' );
        $( '.' + url ).toggleClass( 'form--show' );
        $( '.form--show input[type=text]' ).first().focus();
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

