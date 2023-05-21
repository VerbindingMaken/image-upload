

const fileInput = document.querySelector(".image-upload__input")
const uploadButton = document.querySelector(".image-upload__upload-button");
const imageFrame = document.querySelector('.image-edit__image-frame');

uploadButton.addEventListener('click', selectImageForUpload);
fileInput.addEventListener('change', onFileSelected);


function selectImageForUpload() {
    fileInput.click();
}

function onFileSelected(event) {
    const file = event.target.files[0];
    const fileName = file.name;
    const fileSize = Math.floor(file.size / 1024);
    console.log("Name and size: ", fileName, fileSize);
    displayImage(file);
}

function displayImage(imageFile) {
    const image = new Image();
    const imagePath = URL.createObjectURL(imageFile);
    image.src = imagePath;

    image.addEventListener('load', function () {
        const originalHeight = image.naturalHeight;
        const originalWidth = image.naturalWidth;
        console.log(image, 'Height: ', originalHeight, 'Width: ', originalWidth)

        const imageCanvas = document.querySelector('.image-edit__image-canvas');
        const canvasContext = imageCanvas.getContext('2d');

        imageCanvas.width = originalWidth;
        imageCanvas.height = originalHeight;

        imageCanvas.style.maxWidth = '300px';
        imageCanvas.style.maxHeight = '300px';

        canvasContext.drawImage(image, 0, 0, originalWidth, originalHeight);


    });
}