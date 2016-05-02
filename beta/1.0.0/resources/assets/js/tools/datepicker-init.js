window.addEventListener('load',function () {
    $('.dateType-1').datetimepicker({
        locale: 'fr',
        defaultDate:  moment().format(),
        showClear:true,
        showClose:true,
        format:'dd-MM-YYYY'
        // tooltips: {
        //     today: 'Aujourd’hui',
        //     clear: 'Réinitialiser',
        //     close: 'Fermer',
        //     selectMonth: 'Sélectionez un mois',
        //     prevMonth: 'Mois précèdent',
        //     nextMonth: 'Mois suivant',
        //     selectYear: 'Sélectionnez l’année',
        //     prevYear: 'Année précèdente',
        //     nextYear: 'Année suivante',
        //     selectDecade: 'Sélectionnez décennie',
        //     prevDecade: 'Précédente décennie',
        //     nextDecade: 'prochaine décennie',
        //     prevCentury: 'Century précédent',
        //     nextCentury: 'Suivant Century'
        // }

    });
    $('.hourType-1').datetimepicker({
        format: 'HH:mm',
        inline: true
    });
});
