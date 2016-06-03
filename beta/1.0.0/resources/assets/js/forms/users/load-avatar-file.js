jQuery( function ( $ ) {
    var fReadURL = function ( input ) {
        if ( input.files && input.files[ 0 ] ) {
            var reader = new FileReader();

            reader.onload = function ( e ) {
                $( '#user-avatar' ).attr( {
                    'src': e.target.result
                } );
            };
            reader.readAsDataURL( input.files[ 0 ] );
        }
    };

    $( "#avatar" ).change( function () {
        fReadURL( this );
        $(".profile-avatar__placeholder img").removeClass("animate-avatar").delay(10).queue(function(){
            $(this).addClass("animate-avatar").dequeue();
        });
        $( ".profile-avatar__placeholder" ).attr( "class", "profile-avatar__placeholder avatar--success" );
    } );
} );
