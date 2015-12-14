jQuery( function ( $ ) {
    var fReadURL = function ( input ) {
        if ( input.files && input.files[ 0 ] ) {
            var reader = new FileReader();

            reader.onload = function ( e ) {
                $( '#blah' ).attr( 'src', e.target.result );
            };

            reader.readAsDataURL( input.files[ 0 ] );
        }
    };

    $( "#avatar" ).change( function () {
        fReadURL( this );
    } );
} );