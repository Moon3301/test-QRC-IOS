
function workSuccess(result) {
    $('#status').on('change', function () {
        statusUpdate($(this).val());
    });
    $('.checkbox_item').on('change', function () {
        laborUpdate($(this).val(), $(this).is(':checked'));
    });
    $('.input_value').on('change', function () {
        measurementUpdate($(this).prop('id'), $(this).val());
    });
    $('#send').on('click', function () {
        observationUpdate();
    });

}

function work(id) {
    var data =
    {
        id: id
    }
    openModal('/Maintenance/Work', data, workSuccess);   
}

function statusUpdate(status) {
    var data =
    {
        id: $('#Id').val(),
        status: status
    };
    post('/Maintenance/StatusUpdate', data)
}

function laborUpdate(id, finished) {
    var data =
    {
        id: id,
        finished: finished
    };
    post('/Maintenance/LaborUpdate', data);
}
function measurementUpdate(id, value) {
    var data =
    {
        id: id,
        value: value
    };
    post('/Maintenance/MeasurementUpdate', data)
}

function observationUpdate() {
    var data =
    {
        id: $('#Id').val(),
        observation: $('#observation').val()
    };
    post('/Maintenance/ObservationUpdate', data)
}

