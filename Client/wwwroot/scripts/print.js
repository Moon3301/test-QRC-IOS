function Print(id = 0) {
    var data = {
        maintenanceId: id,
    };
    var url = '/Document/Print';
    $.ajax({
        type: 'POST',
        async: true,
        url: url,
        data: data,
        xhrFields: {
            responseType: 'blob' // Set the response type to blob
        },
        beforeSend: function (msg) {
            hideLoader();
            printStart();
        },
        success: function (data, status, xhr) {
            printStop();
            // Success callback
            if (xhr.getResponseHeader('Content-Disposition')) {
                var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                var matches = filenameRegex.exec(xhr.getResponseHeader('Content-Disposition'));
                var fileName = (matches != null && matches[1]) ? matches[1].replace(/['"]/g, '') : 'default_filename';

                // Create a temporary anchor element and simulate a click to initiate the download
                var link = document.createElement('a');
                link.download = fileName;


                // Create a Blob from the response content
                link.href = window.URL.createObjectURL(data);
                link.click();
            }
        },
        failure: function (response) {
            alert(response);
            hideLoader();
        }
    });
}

function EquipmentPrint(id = 0) {
    var url = '/Document/History';
    $.ajax({
        type: 'POST',
        async: true,
        url: url,
        data: { id },
        xhrFields: {
            responseType: 'blob' // Set the response type to blob
        },
        beforeSend: function (msg) {
            hideLoader();
            printStart();        },
        success: function (data, status, xhr) {
            printStop();
            // Success callback
            if (xhr.getResponseHeader('Content-Disposition')) {
                var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                var matches = filenameRegex.exec(xhr.getResponseHeader('Content-Disposition'));
                var fileName = (matches != null && matches[1]) ? matches[1].replace(/['"]/g, '') : 'default_filename';

                // Create a temporary anchor element and simulate a click to initiate the download
                var link = document.createElement('a');
                link.download = fileName;


                // Create a Blob from the response content
                link.href = window.URL.createObjectURL(data);
                link.click();
            }
        },
        failure: function (response) {
            alert(response);
            hideLoader();
        }
    });
}
