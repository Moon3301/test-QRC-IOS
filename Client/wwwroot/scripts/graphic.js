$(document).ready(function () {
    loadCharts();
    $('.Graphic_Input').on('change', function () {
        loadCharts();
    });
});



function loadCharts() {
    var data = { filter: serialize('#Graphic_Form') };
    loadPie(data, 1);
    loadPie(data, 2);
    loadBar(data, 1);
    loadBar(data, 2);
}





function loadPie(input, shift) {
    input.filter.Shift = shift;
    const id = 'pie' + shift;
    const legend = (shift == 1) ? "Día" : "Noche";

    $.ajax({
        url: '/Index/StatusGraphic',
        type: 'POST',
        headers: { "RequestVerificationToken": $('input[name="__RequestVerificationToken"]').val() },
        data: input,
        success: function (result) {
            Highcharts.chart(id, {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'Mantenimientos: ' + legend,
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                legend: {
                    layout: "horizontal",
                    align: "center",
                    useHTML: true,
                    minHeight: 50,
                    symbolRadius: 0,
                    itemStyle: {
                        fontSize: '14px',
                        fontWeight: 'normal',
                        fontFamily: 'Arial, Sans-Serif',
                        color: '#c0c0c0',
                    },
                },

                accessibility: {
                    point: {
                        valueSuffix: '%'
                    }
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: ({point.y}) - {point.percentage:.1f} %'
                        }
                    }
                },
                series: [{
                    name: 'Maintenances',
                    colorByPoint: true,
                    data: [{
                        name: 'Pendientes',
                        y: result.pending,
                        sliced: true,
                        selected: true
                    }, {
                        name: 'Finalizadas',
                        y: result.finished,
                        sliced: true,
                        selected: true
                    }]
                }]
            });
        }
    });
    
}
function loadBar(input, shift) {
    input.filter.Shift = shift;
    const id = 'bar' + shift;
    const legend = (shift == 1) ? "Día" : "Noche";
    $.ajax({
        url: '/Index/PriorityGraphic',
        type: 'POST',
        headers: { "RequestVerificationToken": $('input[name="__RequestVerificationToken"]').val() },
        data: input,
        success: function (result) {
            var data = [
                {
                    name: 'Pendientes',
                    data: result.pendingPriority
                },
                {
                    name: 'Finalizadas',
                    data: result.finishedPriority
                }
                
            ];
            //console.log(JSON.stringify(result));
            Highcharts.chart(id, {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Criticidad: ' + legend,
                },
                xAxis: {
                    categories: ['<b>CRITICIDAD 1</b>',
                        '<b>CRITICIDAD 2</b>', '<b>CRITICIDAD 3</b>', 
                        '<b>CRITICIDAD 4</b>'
                    ]
                },
                yAxis: {
                    min: 0
                },
                legend: {
                    layout: "horizontal",
                    align: "center",
                    useHTML: true,
                    reversed: true,             
                    minHeight: 50,
                    symbolRadius: 0,
                    itemStyle: {
                        fontSize: '14px',
                        fontWeight: 'normal',
                        fontFamily: 'Arial, Sans-Serif',
                        color: '#c0c0c0',
                    },
                },
                plotOptions: {

                    bar: {
                        dataLabels: {
                            enabled: true
                        }
                    },
                    series:
                    {
                        marker: { fillColor: '#000', },
                        stacking: 'normal'
                    }
                },
                series: data,
                exporting: {
                    enabled: true
                },
                credits: {
                    enabled: true
                }
            });
        }
    });

}

