jQuery( function ( $ ) {

    $( '#datepicker' ).datepicker(
        {
            dateFormat: 'yy-mm-dd',
            minDate: 0
        }
    );

    $.timepicker.regional[ 'fr' ]
    $( '#from' ).timepicker(
        {
            timeFormat: 'hh:mm',
            hourMin: 8,
            hourMax: 16
        }
    );
    $( '#to' ).timepicker(
        {
            timeFormat: 'hh:mm',
            hourMin: 8,
            hourMax: 16
        }
    );
} );