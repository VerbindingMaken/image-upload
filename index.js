

const fileInput = document.querySelector(".image-upload__input")
const uploadButton = document.querySelector(".image-upload__upload-button");
const imageFrame = document.querySelector('.image-edit__image-frame');
const downloadButton = document.querySelector('.image-edit__download-button');
const imageCanvas = document.querySelector('.image-edit__image-canvas');

let fileName = '';
let fileSize = 0;

uploadButton.addEventListener('click', selectImageForUpload);
downloadButton.addEventListener('click', downloadImage)
fileInput.addEventListener('change', onFileSelected);


function selectImageForUpload() {
    fileInput.click();
}

function onFileSelected(event) {
    const file = event.target.files[0];
    const name = file.name;
    const index = name.lastIndexOf('.');
    fileName = name.slice(0, index);
    fileSize = file.size;
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

        const canvasContext = imageCanvas.getContext('2d');

        imageCanvas.width = originalWidth;
        imageCanvas.height = originalHeight;

        imageCanvas.style.maxWidth = '300px';
        imageCanvas.style.maxHeight = '300px';

        canvasContext.drawImage(image, 0, 0, originalWidth, originalHeight);
    });

}

function downloadImage() {
    const temporaryLink = document.createElement('a');

    temporaryLink.download = `${fileName}-download.jpg`;
    temporaryLink.href = imageCanvas.toDataURL("image/jpeg", 1);

    temporaryLink.click();
}