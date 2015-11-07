$( document ).ready( function () {
    var input = $( this );
    function updateText( event ) {
        input = $( this );
        setTimeout( function () {
            console.log( 'ouiii' );
            var val = input.val();
            if ( val != "" )
                input.parent().addClass( "floating-placeholder-float" );
            else
                input.parent().removeClass( "floating-placeholder-float" );
        }, 1 )
    }

    $( ".floating-placeholder input" ).keydown( updateText );
    $( ".floating-placeholder input" ).change( updateText );
    $( ".floating-placeholder input" ).each( function ( e, i ) {
        if ( this.value !== "" ) {
            input = $( this );
            input.parent().addClass( "floating-placeholder-float" );
        }
    } );

} );