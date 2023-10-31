const fileInput = document.getElementById('fileInput');

fileInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function() {
            const image = new Image();
            image.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(image, 0, 0);
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);
                if (code) {
                    sendDataToServer(code.data);
                } else {
                    alert('QR Code não encontrado!');
                }
            };
            image.src = reader.result;
        };
        reader.readAsDataURL(file);
    }
});

function sendDataToServer(data) {
    fetch('/send-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ qrData: data })
    })
    .then(response => response.json())
    .then(data => {
        alert(data.message);
    });
}