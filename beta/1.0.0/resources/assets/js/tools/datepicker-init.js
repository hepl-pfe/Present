window.addEventListener( 'load', function () {
    var datepickerinfo = $( '#planificateSeanceMeta' );
    if ( datepickerinfo.length ) {
        var oUserInfoDate = {
            'defaultschoolyearbegin': datepickerinfo.data( 'defaultschoolyearbegin' ),
            'defaultschoolyearend': datepickerinfo.data( 'defaultschoolyearend' ),
            'defaultcoursduration': datepickerinfo.data( 'defaultcoursduration' ),
            'defaultdaybegin': datepickerinfo.data( 'defaultdaybegin' ),
            'defaultdayend': datepickerinfo.data( 'defaultdayend' )
        };
        $( '.dateType-1' ).datetimepicker( {
            locale: 'fr',
            useCurrent: false,
            showClear: true,
            format: 'YYYY-MM-DD',
            minDate: moment().format( 'YYYY-MM-DD' ),
            maxDate: moment().add( 1, 'years' )
            //inline: true
        } );
        $('.dateType-1+.form-group__svg').click(function (  ) {
            $(this).prev().data( "DateTimePicker" ).toggle();
        });
        $('.hourType-1+.form-group__svg').click(function (  ) {
            $(this).prev().data( "DateTimePicker" ).toggle();
        });
        $( "#from" ).on( "dp.change", function ( e ) {
            $( '#to' ).data( "DateTimePicker" ).minDate( e.date );
        } );
        $( "#to" ).on( "dp.change", function ( e ) {
            $( '#from' ).data( "DateTimePicker" ).maxDate( e.date );
        } );

        $( '.hourType-1' ).datetimepicker( {
            format: 'HH:mm',
            showClear: true,
            useCurrent: false,
            stepping: 5
            //inline: true
        } );
        $( "#from_hour" ).on( "dp.change", function ( e ) {
            $( '#to_hour' ).data( "DateTimePicker" ).minDate( e.date );
        } );
        $( "#to_hour" ).on( "dp.change", function ( e ) {
            $( '#from_hour' ).data( "DateTimePicker" ).maxDate( e.date );
        } );
    }
} );
