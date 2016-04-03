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
                if ( attr.id ) {
                    aPressences.push( [ new Date( attr.occurrence.from ), attr.is_present ] );
                }
            }
            //console.log(  );
        }
        dataTable.addRows( aPressences );

        var chart   = new google.visualization.Calendar( document.getElementById( 'calendar_basic' ) );
        var options = {
            title: "Présence de l’élève",
            height: 200,
            tooltip: { isHtml: true },   // CSS styling affects only HTML tooltips.
            legend: { position: 'true' },
            minValue: 0,
            colors: ['red', 'blue'],
            bar: { groupWidth: '90%' },
            calendar: {
                cellColor: {
                    stroke: 'white',
                    strokeWidth: 1,
                    backgroundColor: 'red'
                }
            },
            noDataPattern: {
                backgroundColor: '#C5C5C5',
                color: '#C5C5C5'
            }

        };

        chart.draw( dataTable, options );
    }
}
