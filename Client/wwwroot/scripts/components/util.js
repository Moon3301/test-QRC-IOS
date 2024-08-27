    function generateQRCode(id, text) {
        return new QRCode(id, {
            text: text,
            width: 200,
            height: 200,
            colorDark: "#ff9663",
            colorLight: "#000",
            correctLevel: QRCode.CorrectLevel.H,
        });
    }

//console.log(qrCode.makeCode("prueba"));

function onScanSuccess(content) {
    //alert(content);
    window.location.href = content;
}

var html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", {
    facingMode: "environment",
    fps: 10,
    qrbox: 360
});
html5QrcodeScanner.render(onScanSuccess);