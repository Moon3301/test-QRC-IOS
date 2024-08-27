function create() {
    $.ajax({
        url: '/Labor?handler=Update',
        type: 'GET',
        success: function (result) {
            openModal(result);
        }
    });
}
function update(id) {
    var data = { id: id };
    $.ajax({
        url: '/Labor?handler=Update',
        type: 'GET',
        data: data,
        success: function (result) {
            openModal(result, 'small');
            $('.labor_input').on('change', function () {
                change();
            });
        }
    });
}

function change() {
    var data = {
        input: serialize('labor_form'),
    };
    $.ajax({
        url: '/Labor?handler=Change',
        type: 'POST',
        headers: { "RequestVerificationToken": $('input[name="__RequestVerificationToken"]').val() },
        data: data,
        success: function () {
        }
    });
}
