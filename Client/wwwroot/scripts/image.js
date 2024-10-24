const $images = $('#images');

var imagesArray = ($images != undefined && $images.val() != null && $images.val() != '') ? $images.val().split(';') : [];

if (imagesArray != []) {
    imagesArray.forEach(file => displayThumbnail(file));
}

function uploadImages(input, width = 640, height = 480) {
    showLoader();
    const files = input.files;

    if (files.length) {
        let quantity = files.length > 6 ? 6 : files.length;
        for (let i = 0; i < quantity; i++) {
            const file = files[i];
            // Ensure it's an image
            if (file && file.type.match(/image.*/)) {
                const reader = new FileReader();
                reader.onload = function (readerEvent) {
                    const image = new Image();
                    image.onload = function () {
                        const canvas = $('<canvas/>')[0];
                        canvas.width = width;
                        canvas.height = height;
                        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
                        const dataUrl = canvas.toDataURL('image/jpeg', .63);
                        const resizedImage = dataURLToBlob(dataUrl);
                        $.event.trigger({
                            type: "imageResized",
                            blob: resizedImage,
                            url: dataUrl,
                        });
                    }
                    image.src = readerEvent.target.result;
                }
                reader.readAsDataURL(file);
            }
        }
        $('#success').show();
    }
}


$(document).on("imageResized", function (event) {
    const data = new FormData($('form')[0]);
    if (event.blob && event.url) {
        data.append('image_data', event.blob);

        $.ajax({
            type: 'POST',
            url: '/Upload/Multipart',
            data: data,
            contentType: false,
            processData: false,
            headers: {
                RequestVerificationToken: $('input:hidden[name="__RequestVerificationToken"]').val()
            },
            success: function (result) {
                displayThumbnail(result);
                hideLoader();
            },
            error: function (response) {
                alert(response);
            }
        });
    }
});

function displayThumbnail(file) {
    const sanitizedFile = $("<div>").text(file).html(); // sanitize user input
    const url = '/uploads/' + sanitizedFile;
    const thumbnail = $('<img/>', { src: url, width: 45 });
    const link = $('<a href="javascript:void(0)" class="delete-image" data-file="' + sanitizedFile + '"><i class="icon-x"></a>');
    link.on('click', () => deleteFile(file));
    const item = $('<li class="thumbnail-container"></li>').append(thumbnail, link);
    $('#thumbnails').append(item);
    imagesArray.push(file); // Add to the categories array
}

function dataURLToBlob(dataURL) {
    const BASE64_MARKER = ';base64,';
    const parts = dataURL.split(BASE64_MARKER);
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const uInt8Array = new Uint8Array(raw.length);

    for (let i = 0; i < raw.length; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], { type: contentType });
}

function deleteFile(file) {
    const success = function () {
        $('[data-file="' + file + '"]').closest('.thumbnail-container').remove();
        hideLoader();
    };
    post('/Upload/Delete', file, success); // Ensure that your 'post' method is also secure
}
