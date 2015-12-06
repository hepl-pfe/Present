jQuery( function ( $ ) {
    $.timepicker.regional[ 'fr' ];

    $( '.datepicker' ).datepicker(
        {
            dateFormat: 'yy-mm-dd',
            minDate: 0
        }
    );

    $( '.from' ).timepicker(
        {
            timeFormat: 'hh:mm',
            hourMin: 8,
            hourMax: 16
        }
    );
} );