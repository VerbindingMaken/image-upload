

const fileInput = document.querySelector(".image-upload__input")
const uploadButton = document.querySelector(".image-upload__upload-button");
const downloadButton = document.querySelector('.image-edit__download-button');
const cropButton = document.querySelector('.image-edit__crop-button');
const resetButton = document.querySelector('.image-edit__reset-button')
const canvasFrame = document.querySelector('.image-edit-canvas-frame');
const selectionBox = document.querySelector('.image-edit__selection-box');

fileInput.addEventListener('change', onFileSelected);
uploadButton.addEventListener('click', selectImageForUpload);
downloadButton.addEventListener('click', downloadImage);
cropButton.addEventListener('click', cropImage);
resetButton.addEventListener('click', resetImage);
selectionBox.addEventListener('mousedown', clickSelectionBox)
selectionBox.addEventListener('dragstart', () => false);

const canvas = document.querySelector('.image-edit__canvas');
const canvasContext = canvas.getContext("2d");

// Image and image information
const originalImage = {
    name: "",
    size: 0,
    width: 0,
    height: 0,
    element: new Image()
}

// const resize = {
//     x: 0,
//     y: 0,
//     newWidth: originalImage.width,
//     newHeight: originalImage.height
// }

let imageLoaded = false;

function selectImageForUpload() {
    fileInput.click();
}

function onFileSelected(event) {
    const file = event.target.files[0];
    const name = file.name;
    const index = name.lastIndexOf('.');
    originalImage.name = name.slice(0, index);
    originalImage.size = file.size;
    displayImage(file);
}

function displayImage(imageFile) {
    const imagePath = URL.createObjectURL(imageFile);
    originalImage.element.src = imagePath;

    originalImage.element.addEventListener('load', function () {
        originalImage.width = originalImage.element.naturalWidth;
        originalImage.height = originalImage.element.naturalHeight; ``

        console.log(originalImage);

        canvas.width = originalImage.width;
        canvas.height = originalImage.height;

        console.log('canvas: ', canvas.width, canvas.height, canvas);

        canvas.style.maxWidth = '300px';
        canvas.style.maxHeight = '300px';

        canvasContext.drawImage(originalImage.element, 0, 0, originalImage.width, originalImage.height);

        selectionBox.style.display = "block";
        imageLoaded = true;
    });

}

function downloadImage() {
    if (imageLoaded) {
        const temporaryLink = document.createElement('a');

        temporaryLink.download = `${originalImage.name}-download-resize-2.jpg`;
        temporaryLink.href = canvas.toDataURL("image/jpeg", 1);

        temporaryLink.click();
    }
}

function resizeImage(x, y, width, heigth) {
    if (imageLoaded) {
        console.log('resize with: ', x, y, width, heigth);

        canvas.width = width;
        canvas.height = heigth;

        if (x === 0 && y === 0) {
            canvasContext.drawImage(originalImage.element, x, y, width, heigth);
        }
        else {
            canvasContext.drawImage(originalImage.element, x, y, width, heigth, 0, 0, width, heigth);
        }
    }
}

function cropImage() {
    const newHeight = 150;
    const newWidth = Math.floor(150 * (originalImage.width / originalImage.height));

    resizeImage(1500, 2500, newWidth, newHeight);
}

function resetImage() {
    resizeImage(0, 0, originalImage.width, originalImage.height);
}

function clickSelectionBox(clickEvent) {

    console.log('mouseclick')

    const pointerX = clickEvent.offsetX;
    const pointerY = clickEvent.offsetY;

    function moveSelectionBox(moveEvent) {

        const rectangle = canvasFrame.getBoundingClientRect();
        const left = (moveEvent.clientX - pointerX) - rectangle.left;
        const top = (moveEvent.clientY - pointerY) - rectangle.top;

        selectionBox.style.left = `${left}px`;
        selectionBox.style.top = `${top}px`;
    }

    console.log('add event listener for move')

    selectionBox.addEventListener('mousemove', moveSelectionBox);
    selectionBox.addEventListener('mouseup', () => {
        console.log('remove')
        selectionBox.removeEventListener('mousemove', moveSelectionBox);
        selectionBox.removeEventListener('mouseup');
    })


}