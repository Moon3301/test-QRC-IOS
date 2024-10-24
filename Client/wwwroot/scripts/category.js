function create() {
    $.ajax({
        url: '/Category?handler=Update',
        type: 'GET',
        success: function (result) {
            openModal(result);
        }
    });
}
function update(id) {
    var data = { id: id };
    $.ajax({
        url: '/Category?handler=Update',
        type: 'GET',
        data: data,
        success: function (result) {
            openModal(result, 'small');
            $('.category_input').on('change', function () {
                change();
            });
        }
    });
}

function change() {
    var data = {
        input: serialize('category_form'),
    };
    $.ajax({
        url: '/Category?handler=Change',
        type: 'POST',
        headers: { "RequestVerificationToken": $('input[name="__RequestVerificationToken"]').val() },
        data: data,
        success: function () {
        }
    });
}


function asociationList(entity, id) {
    var data =
    {
        id: id
    };
    $.ajax({
        url: '/Category?handler='+ entity +'List',
        type: 'GET',
        data: data,
        success: function (result) {
            var size = 'small';
            if (entity == 'labor') size = 'medium';
            openModal(result);
            $('.checkbox-item').on('change', function () {
                asociationUpdate(entity, $(this).val(), $(this).is(':checked'));
            });
        },
        failure: function (result) {
            alert('Error');
        }
    });
}
function asociationUpdate(entity, id, asociated) {
    var data =
    {
        id: id,
        asociated: asociated
    };
    $.ajax({
        url: '/Category?handler=' + entity + 'Update',
        type: 'POST',
        headers: { "RequestVerificationToken": $('input[name="__RequestVerificationToken"]').val() },
        data: data,
        success: function (result) {
        },
        failure: function (result) {
            alert('Error');
        }
    });
}

