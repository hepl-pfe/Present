jQuery( function ( $ ) {
    $eFilterLink = $( ".toogle-filter-result" );
    if($eFilterLink.length>0){
        $eFilterLink.click( function ( even ) {
            even.preventDefault();
            fShowFilter( $(this), 'toogle-filter-result--close' );
        } );
        fShowFilter = function ( element, classe ) {
            element.toggleClass( classe );
        };
        fShowFilter( $eFilterLink, 'toogle-filter-result--close' );
    }

} );