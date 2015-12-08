google.load("visualization", "1.1", {packages:["calendar"]});
google.setOnLoadCallback(drawChart);

function drawChart() {
    var dataTable = new google.visualization.DataTable();
    dataTable.addColumn({ type: 'date', id: 'Date' });
    dataTable.addColumn({ type: 'number', id: 'Won/Loss' });
    dataTable.addRows([
        [ new Date(2012, 3, 13), 37032 ],
        [ new Date(2012, 3, 14), 38024 ],
        [ new Date(2012, 3, 15), 38024 ],
        [ new Date(2012, 3, 16), 38108 ],
        [ new Date(2012, 3, 17), 38229 ],

    ]);

    var chart = new google.visualization.Calendar(document.getElementById('calendar_basic'));

    var options = {
        title: "Présence de l’élève",
        height: 300
    };

    chart.draw(dataTable, options);
}