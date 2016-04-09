var ePiechartSeances = $( ".piechart-seances" );
if ( ePiechartSeances.length ) {
    google.charts.load( 'current', { 'packages': [ 'corechart' ] } );
    ePiechartSeances.each(
        function () {
            var that = $( this );
            google.charts.setOnLoadCallback( chartLoader );
            function chartLoader() {
                var aDataTable      = [ [ 'Task', '' ] ],
                    oDataAttributes = that.data(),
                    slices          = {};
                for ( key in oDataAttributes ) {
                    if ( oDataAttributes.hasOwnProperty( key ) ) {
                        var aCurentData                = oDataAttributes[ key ].split( "," );
                        aDataTable[ aCurentData[ 0 ] ] = [ aCurentData[ 1 ], parseInt( aCurentData[ 2 ] ) ];
                        slices[ (aCurentData[ 0 ])-1 ] = { 'color': aCurentData[ 3 ] }
                    }
                }
                console.log( slices );
                var data    = google.visualization.arrayToDataTable( aDataTable );
                var options = {
                    'tooltip': { 'isHtml': true },
                    slices

                };

                var chart = new google.visualization.PieChart( that.get( 0 ) );
                chart.draw( data, options );
            }
        }
    );

}
