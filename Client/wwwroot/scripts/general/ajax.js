var _modalStack = [];

function openModal(url, data = null, callback = null, closable = true) {
    if (_modalStack.length == 0) $('#modal').show().animate({ opacity: 1 }, 10);
    const id = url.replaceAll('/', '_');
    _modalStack.push(id);
    const success = function (result) {
        $('#modal').append("<div id='" + id + "' class='modal'><div class='view animated slide'></div></div>");
        const current = $('#' + id);

        const view = $('#' + id + ' .view');
        const html = (closable) ? "<span class='close'>&times;</span>" + result : result;
        view.html(html);

        const first = $('#' + id + ' .view div:first');
        const css = first.attr('class');

        if (css != undefined) {
            first.removeClass();
            view.addClass(css);
        }
        if (closable) {
            $('#' + id + ' .close').click(function () {
                closeModal();
            });
        }

        current.css('z-index', 10000 + _modalStack.length)

        if (callback != null) callback(result);

        $('#' + id + ' .modal').css('display', 'block');
        //window.scrollTo({ top: 0, behavior: 'smooth' });


    }

    post(url, data, success);
}

function closeModal() {
    const modal = $('#' + _modalStack.pop());
    modal.animate({ opacity: 0 }, 100, function () {
        $(this).hide();
    });
    modal.remove();
    if (_modalStack.length === 0) {
        $('#modal').animate({ opacity: 0 }, 100, function () {
            $(this).hide();
        });
    }
}
function request(type, url, data = null, callback = null) {
    $.ajax({
        type: type,
        url: url,
        data: data,
        async: true,
        headers: { "RequestVerificationToken": $('input[name="__RequestVerificationToken"]').val() },
        beforeSend: function () {
            showLoader();
        },
        success: function (result) {
            if (callback != null) callback(result);
            hideLoader();
        },
        failure: function (response) {
            alert(response);
        }
    });
}

function get(url, data = null, callback = null) {
    request('GET', url, data, callback);
}
function post(url, data = null, callback = null) {
    request('POST', url, data, callback);
}

function edit(entity = null, id = 0, callback = null) {
    const url = '/' + entity + '/Edit';
    request('POST', url, { id }, callback);
}
function update(entity = null, callback = null) {
    const url = '/' + entity + '/Update';
    const data = serialize('#' + entity + '_Form');
    request('POST', url, data, callback);
}

function remove(entity = null, parameters = null, callback = null) {
    if (confirm('Eliminar?') == true) {
        const url = '/' + entity + '/Delete';
        request('POST', url, parameters, callback);
    }
}



function filter(entity, parameters) {
    const success = function (result) {
        var element = 'result_' + entity.toLowerCase();
        $('#' + element).html(result);
        scrollToElement(element);
    }
    const url = '/' + entity + '/filter';
    request('POST', url, parameters, success);
}




function sanitizeInput(value, type) {
    switch (type) {
        case 'text':
            // For text, escape HTML to prevent XSS
            return value.replace(/</g, "&lt;").replace(/>/g, "&gt;");
        case 'checkbox':
            // For checkboxes, ensure the value is boolean
            return !!value;
        // Add more cases as needed for other input types
        default:
            // If the type is unknown, return the raw value
            return value;
    }
}

function serialize(path, prefix = "Input.") {
    var $form = $(path);
    var input = {};

    // Iterate over each form element
    $form.find(':input').each(function () {
        var $this = $(this);
        var name = $this.attr('name');
        var value = $this.val();
        var type = $this.attr('type');

        // If the element has no name, skip
        if (!name) return;

        // Handle checkboxes
        if (type === 'checkbox') {
            value = $this.prop('checked');
        }
        
        // Remove the prefix from the name
        var key = name.replace(prefix, '');

        // If the key already exists, make sure it's stored as an array
        if (input[key]) {
            if (!$.isArray(input[key])) {
                input[key] = [input[key]];
            }
            input[key].push(value);
        } else {
            input[key] = value;
        }
    });
    return input;
}


function Create(entity) {
    Edit(entity, 0);
}

function Edit(entity, id) {
    var input = { id: id };
    var success = function () {
        if (entity == 'Equipment') {
            EquipmentPart();
            $('.modal #Input_CategoryId').on('change', function () {
                EquipmentPart();
            });
        }
        $('.modal .' + entity + '_Input').on('change', function () {
            Update(entity);
        });
    }
    openModal('/' + entity + '/Edit', input, success);
}

function Update(entity) {
    var data = {
        input: serialize('.modal #' + entity + '_Form')
    };

    var success = function (result) {
        $('.modal #Equipment_Form > #Input_Id').val(result);
        if (entity == 'Equipment') {
            EquipmentPart();
            EquipmentFilter();
        }
    }
    post('/' + entity + '/Update', data, success);
}



function Association(parent, child, parentId) {
    var url = '/' + parent + '/' + child;
    var data =
    {
        parentId: parentId
    };
    var success = function () {
        $('.association').on('change', function () {
            associationUpdate(parent, child, $(this).val(), $(this).is(':checked'));
        });
    }
    openModal(url, data, success);

}

function AssociationUpdate(parent, child, id, associated) {
    var url = '/' + parent + '/' + child + 'Update';
    var data =
    {
        id: id,
        associated: associated
    };
    post(url, data);
}





function autocomplete(target, url, success = null, select = null) {
    $(target).autocomplete({
        source: function (request, response) {
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: {
                    term: request.term
                },
                success: function (result) {
                    //console.log("Server response:", result); // Log the server response
                    hideLoader();

                    // The response from the server is already JSON, no need to parse it
                    if (Array.isArray(result)) {
                        let data = result.map(function (item) {
                            return {
                                id: item.id,   // Ensure the property names match the server response
                                label: item.title  // Ensure the property names match the server response
                            };
                        });
                        response(data);
                        if (success != null) {
                            success(result);
                        }
                    } else {
                        console.error('Parsed result is not an array:', result);
                        if (success != null) success([]);
                    }
                },
                error: function () {
                    console.error("Autocomplete request failed");
                    response([]);
                }
            });
        },
        minLength: 0,
        autoSelect: true,
        autoFocus: true,
        matchContains: true,
        minChars: 0,
        search: function () {
            showLoader();
        },
        select: function (event, ui) {
            event.preventDefault();
            if (select != null) {
                select(ui);
            }
            return false;
        }
    }).click(function () {
        $(this).autocomplete('search', '*');
    });
}






function download(url, data) {
    $.ajax({
        type: 'POST',
        async: true,
        url: url,
        data: data,
        xhrFields: {
            responseType: 'blob' // Set the response type to blob
        },
        beforeSend: function (msg) {
           showLoader();
        },
        success: function (result, status, xhr) {
            hideLoader();
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


function loadScriptAndExecute(url, callback, ...params) {
    var script = document.createElement('script');
    script.src = url;

    script.onload = function () {
        // Code to be executed after the script has loaded
        callback(...params);
    };
    document.head.appendChild(script);
}


