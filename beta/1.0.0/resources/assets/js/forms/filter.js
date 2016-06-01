jQuery( function ( $ ) {
    $eFilterLink = $( ".toogle-filter-result" );
    if ( $eFilterLink.length > 0 ) {
        $eFilterLink.click( function ( even ) {
            even.preventDefault();
            fShowFilter( $( this ), 'toogle-filter-result--close' );
        } );
        fShowFilter = function ( element, classe ) {
            if ( element.text().charAt( 0 ) == 'C' ) {
                element.text( 'Afficher l’outil d’affichage !' );
            }
            else {
                element.text( 'Cacher l’outil d’affichage !' );
            }
            console.log();
            element.toggleClass( classe );
        };
        fShowFilter( $eFilterLink, 'toogle-filter-result--close' );
    }

} );