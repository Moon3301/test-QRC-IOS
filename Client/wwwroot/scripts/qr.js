function generateQRCode(id, text) {
    return new QRCode(id, {
        text: text,
        width: 200,
        height: 200,
        colorDark: "#a333ff",
        colorLight: "#000",
        correctLevel: QRCode.CorrectLevel.H,
    });
}



var html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", {
    facingMode: "environment",
    fps: 10,
    qrbox: 360
});

html5QrcodeScanner.render(scanSuccess);
$("#reader").addClass("borderless");


function scanSuccess(content) {
    html5QrcodeScanner.clear();
    var qr = content.split(',')[0];
    openModal('/Index/QR', { qr: qr });
}