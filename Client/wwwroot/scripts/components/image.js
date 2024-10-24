
function updateImage(before, after) {
    if(before != '') deleteFile(before);
    $('#display').attr("src", "/images/" + after);
    $('#Input_Image').val(after);
    hideLoader();
}

function uploadImage(before, after, success = null, width = 1080, height = 462) {
    showLoader();
    if (after && after.type.match(/image.*/)) {
        const reader = new FileReader();
        reader.onload = function (readerEvent) {
            const image = new Image();
            image.onload = function () {
                // Create a canvas element
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                // Calculate the new height to maintain aspect ratio
                const ratio = width / image.width;
                const newHeight = image.height * ratio;

                // Determine if cropping is necessary
                let srcHeight = image.height;
                let srcY = 0;
                if (newHeight > height) {
                    // Calculate the source dimensions for cropping
                    srcHeight = height / ratio;
                    srcY = (image.height - srcHeight) / 2; // Center the crop vertically
                }

                // Adjust canvas size
                canvas.width = width;
                canvas.height = Math.min(newHeight, height);

                // Clear the canvas
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                // Draw the image on the canvas, cropping if necessary
                ctx.drawImage(image, 0, srcY, image.width, srcHeight, 0, 0, width, canvas.height);

                const dataUrl = canvas.toDataURL('image/webp', 0.9);
                const resizedImage = dataURLToBlob(dataUrl); // Assuming this function is defined elsewhere

                // Trigger a custom event or handle the resized image as needed
                if (typeof $.event.trigger === "function") { // Ensure jQuery is loaded
                    $.event.trigger({
                        type: "imageResized",
                        blob: resizedImage,
                        url: dataUrl,
                        onSuccess: function (result) {
                            if (typeof success === "function") {
                                success(before, result);
                            }
                            hideLoader();
                        }
                    });
                }
            };
            image.src = readerEvent.target.result;
        };
        reader.readAsDataURL(after);
    }
}

function uploadImages(input, width = 1080, height = 462) {
    showLoader();
    const files = input.files;

    if (files.length) {
        let quantity = files.length > 6 ? 6 : files.length;
        for (let i = 0; i < quantity; i++) {
            uploadImage(files[i], width, height)
        }
    //    $('#success').show();
    }
}


$(document).on("imageResized", function (event) {
    const data = new FormData($('form')[0]);
    if (event.blob && event.url) {
        data.append('image_data', event.blob);
        $.ajax({
            type: 'POST',
            url: '/Image/Multipart',
            data: data,
            contentType: false,
            processData: false,
            headers: {
                RequestVerificationToken: $('input:hidden[name="__RequestVerificationToken"]').val()
            },
            success: function (result) {
                if (typeof event.onSuccess === "function") {
                    event.onSuccess(result);
                }
            },
            error: function (response) {
                alert(response);
            }
        });
    }
});
    



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
    post('/Image/Delete', { file });
}
