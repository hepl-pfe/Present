if ( document.getElementById( 'calendar_basic' ) ) {
    google.load( "visualization", "1.1", { packages: [ "calendar" ] } );
    google.setOnLoadCallback( drawChart );
    var aPressences = [];

    function drawChart() {
        var dataTable = new google.visualization.DataTable();
        dataTable.addColumn( { type: 'date', id: 'Date' } );
        dataTable.addColumn( { type: 'number', id: 'Won/Loss' } );
        for ( var index in presences ) {
            if ( presences.hasOwnProperty( index ) ) {
                var attr = presences[ index ];
                aPressences.push( [ new Date( attr.created_at ), 0 ] );
            }
        }
        console.log( aPressences );
        dataTable.addRows( aPressences );

        var chart   = new google.visualization.Calendar( document.getElementById( 'calendar_basic' ) );
        var options = {
            title: "Présence de l’élève",
            height: 300
        };

        chart.draw( dataTable, options );
    }
}