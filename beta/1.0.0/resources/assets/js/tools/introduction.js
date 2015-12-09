jQuery( function ( $ ) {
    if(bIsFirstConnect){
        introJs().start();
        introJs().setOption( "skipLabel", "Finir" );
    }
} );