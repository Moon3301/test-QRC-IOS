$(document).ready(function () {

    // Bind the filterData function to the change event of the filter inputs
    $('.Equipment_Input').on('change', function () {
        EquipmentFilter();
    });

    $('#Input_OrganizationId').on('change', function () {
        UserCollection();
        CategoryCollection();
        EquipmentFilter();
    });

    $('#Input_CategoryId').on('change', function () {
        EquipmentFilter();
    });

    if (window.location.href.toLowerCase().endsWith('equipment')) {
        CategoryCollection();
        UserCollection();
        EquipmentFilter();

        AutocompletePhysicalFile();
    }
});



function AutocompletePhysicalFile() {
    var select = function (ui) {
        $("#Equipment_Form #Input_PhysicalFile").val(ui.item.value);
        EquipmentFilter();
    }
    autocomplete("#Equipment_Form #Input_PhysicalFile", "/Equipment/PhysicalFileAutocomplete", null, select);
}

function PaginationInput(entity, pageIndex = 1) {
    return {
        Entity: entity,
        PageIndex: pageIndex,
        PageSize: $('#' + entity + '_Result #PageSize').val() ?? 10,
        PageCount: $('#' + entity + '_Result #PageCount').val() ?? 1,
    }
}

function EquipmentInput(pageIndex = 1) {
    var input = {
        equipment: serialize('#Equipment_Form'),
        pages: PaginationInput('Equipment', pageIndex),
    }
    input.equipment.Month = $('#month').val();
    return input;
}


function Filter(entity, pageIndex = 1) {
    switch (entity) {
        case 'Equipment': EquipmentFilter(pageIndex);
            break;
        case 'Maintenance': MaintenanceFilter(pageIndex);
            break;
    }
}

function EquipmentUpdate() {
    Update('Equipment');
}

function MaintenanceUpdate() {
    Update('Maintenance');
}

function EquipmentFilter(pageIndex = 1) {
    var input = EquipmentInput(pageIndex);
    var success = function (result) {
        $('#Equipment_Result').html(result);
    }
    post('/Equipment/Filter', input, success);
}


function EquipmentDelete(id = 0) {
    if (confirm("Eliminar?") == true) {
        var input = {
            filter: serialize('#Equipment_Form'),
        };
        if (id != 0) {
            input.filter.Id = id;
        }
        var success = function (result) {
            EquipmentFilter();
        }
        post('/Equipment/Delete', input, success);
    }
}


function EquipmentPart() {
    var input = {
        filter: serialize('.modal #Equipment_Form')
    }
    //input.filter.Id = $('.modal #Equipment_Form #Input_Id').val();
    var success = function (result) {
        $('.modal #Equipment_Part').html(result);
    }
    post('/Equipment/Part', input, success);
}

function EquipmentPartUpdate(data) {
    var input =
    {
        Id: data.getAttribute("id"),
        EquipmentId: data.getAttribute("equipment"),
        PartId: data.getAttribute("part"),
        NominalValue: data.value
    };
    post('/Equipment/PartUpdate', input)
}

function MaintenanceInput(pageIndex = 1) {

    var equipment = serialize('#Equipment_Form');
    var filter = serialize('#Maintenance_Form');
    filter.EquipmentId = equipment.Id;

    if (filter.OrganizationId == 0)
        filter.OrganizationId = equipment.OrganizationId;
    if (filter.CategoryId == 0)
        filter.CategoryId = equipment.CategoryId;
    if (filter.PhysicalFile === undefined)
        filter.PhysicalFile = equipment.PhysicalFile;

    filter.Month = $('#month').val();
    filter.Year = $('#year').val();

    var input = {
        filter: filter,
        pages: PaginationInput('Maintenance', pageIndex)
    }
    return input;
}

function MonthPrint() {
    var url = '/Document/Month';
    $.ajax({
        type: 'POST',
        async: true,
        url: url,
        data: {
            month: $('#month').val(),
            year: $('#year').val()
        },
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

function MaintenanceIndex(equipmentId = 0) {
    $(".modal #Input_EquipmentId").val(equipmentId);

    var data = MaintenanceInput();
    var success = function (result) {
        $('.Maintenance_Input').on('change', function () {
            /*$(".modal #Input_EquipmentId").val(0);*/
            MaintenanceFilter();
        });
        hideLoader();
    }
    openModal('/Maintenance/Index', data, success);
}

function EquipmentHistory(id = 0) {
    openModal('/Equipment/History', { id }, null);
}



function MaintenanceFilter(pageIndex = 1) {
    var input = MaintenanceInput(pageIndex);
    var success = function (result) {
        $('#Maintenance_Result').html(result);
        hideLoader();
    }
    post('/Maintenance/Filter', input, success);
}

function Label(id = 0) {
    var data = {
        EquipmentId: id,
    };
    var url = '/Document/Label';
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



function MaintenanceCreate() {
    var input = {
        filter: serialize('#Equipment_Form'),
        supervisorId: $('#Maintenance_SupervisorId').val(),
        technicianId: $('#Maintenance_TechnicianId').val(),
        helperId: $('#Maintenance_HelperId').val(),
        programmed: $('#Maintenance_Programmed').val(),

    };
    input.filter.Month = $('#month').val();
    var success = function (result) {
        $('.Maintenance_Input').on('change', function () {
            MaintenanceFilter();
        });
    }
    openModal('/Maintenance/Create', input, success);
}



function CategoryCollection() {
    var success = function (result) {
        var optionsHtml = '<option value=0>Selecciona</option>';
        $.each(result, function (index, item) {
            optionsHtml += '<option value="' + item.id + '">' + item.descr + '</option>';
        });
        $('#Input_CategoryId').html(optionsHtml);
    }
        post('/Category/Index', { organization: $('#Input_OrganizationId').val() }, success);
}



function UserCollection() {
    var success = function (result) {

        var optionsHtml = '';
        $.each(result.supervisor, function (index, item) {
            optionsHtml += '<option value="' + item.id + '">' + item.name + '</option>';
        });
        $('#Maintenance_SupervisorId').html(optionsHtml);

        optionsHtml = '';
        $.each(result.technician, function (index, item) {
            optionsHtml += '<option value="' + item.id + '">' + item.name + '</option>';
        });
        $('#Maintenance_TechnicianId').html(optionsHtml);

        optionsHtml = '';
        $.each(result.helper, function (index, item) {
            optionsHtml += '<option value="' + item.id + '">' + item.name + '</option>';
        });
        $('#Maintenance_HelperId').html(optionsHtml);
    };
    var data = { organizationId: $('#Input_OrganizationId').val() }
    post('/Organization/UserCollection', data, success);
}
function Work(id) {
    openModal('/Maintenance/Work', { id });
}




function Batch() {
    var data = MaintenanceInput();
    var url = '/Document/Batch';
    $.ajax({
        type: 'POST',
        async: true,
        url: url,
        data: data,
        headers: { "RequestVerificationToken": $('input[name="__RequestVerificationToken"]').val() },
        beforeSend: function () {
            hideLoader();
            printStart();
        },
        success: function (result) {
            printStop();
        },
        error: function (response) {
            watch('Error: ' + response.status + ' - ' + response.statusText);
            hideLoader();
        }
    });
}
