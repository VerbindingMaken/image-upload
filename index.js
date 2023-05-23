
// Elements
const fileInput = document.querySelector(".image-upload__input")
const uploadButton = document.querySelector(".image-upload__upload-button");
const downloadButton = document.querySelector('.image-edit__download-button');
const cropButton = document.querySelector('.image-edit__crop-button');
const resetButton = document.querySelector('.image-edit__reset-button')
const canvasFrame = document.querySelector('.image-edit-canvas-frame');
const selectionBox = document.querySelector('.image-edit__selection-box');
const resizeHandleSelectionBox = document.querySelector('.image-edit__resize-handle-selection-box');

// Event listeners on elements
fileInput.addEventListener('change', onFileSelected);
uploadButton.addEventListener('click', selectImageForUpload);
downloadButton.addEventListener('click', downloadImage);
cropButton.addEventListener('click', cropImage);
resetButton.addEventListener('click', resetImage);
selectionBox.addEventListener('mousedown', clickSelectionBox);
// Prevent browser default dragstart event
selectionBox.addEventListener('dragstart', () => false);
resizeHandleSelectionBox.addEventListener('mousedown', clickResizeHandleSelectionBox);
resizeHandleSelectionBox.addEventListener('dragstart', () => false);

// Image canvas
const canvas = document.querySelector('.image-edit__canvas');
const canvasContext = canvas.getContext("2d");

// Image and image information, set after image is selected; 
const originalImage = {
    name: "",
    size: 0,
    width: 0,
    height: 0,
    scale: 0,
    element: new Image()
}

let selectionBoxDimensions = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
}

let isImageLoaded = false;
let isSelectionResizing = false

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

        canvas.width = originalImage.width;
        canvas.height = originalImage.height;

        canvas.style.maxWidth = '300px';
        canvas.style.maxHeight = '300px';

        canvasContext.drawImage(originalImage.element, 0, 0, originalImage.width, originalImage.height);

        originalImage.scale = originalImage.width / canvas.offsetWidth;

        selectionBox.style.display = "block";
        resizeHandleSelectionBox.style.display = "block";

        isImageLoaded = true;
    });
}

function downloadImage() {

    if (isImageLoaded) {
        const temporaryLink = document.createElement('a');

        temporaryLink.download = `${originalImage.name}-${selectionBoxDimensions.width}-${selectionBoxDimensions.height}.jpg`;
        temporaryLink.href = canvas.toDataURL("image/jpeg", 1);

        temporaryLink.click();
    }
}

function resizeImage(x, y, width, heigth) {

    if (isImageLoaded) {

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

    resizeImage(
        selectionBoxDimensions.x,
        selectionBoxDimensions.y,
        selectionBoxDimensions.width,
        selectionBoxDimensions.height
    )

    selectionBox.style.display = "none";
    resizeHandleSelectionBox.style.display = "none";
}

function resetImage() {

    resizeImage(0, 0, originalImage.width, originalImage.height);

    selectionBox.style.display = "block";
    resizeHandleSelectionBox.style.display = "block";
}



function clickSelectionBox(clickEvent) {

    if (!isSelectionResizing) {

        const pointerX = clickEvent.offsetX;
        const pointerY = clickEvent.offsetY;



        function moveSelectionBox(moveEvent) {

            const rectangle = canvas.getBoundingClientRect();
            const left = Math.floor((moveEvent.clientX - pointerX) - rectangle.left);
            const top = Math.floor((moveEvent.clientY - pointerY) - rectangle.top);

            selectionBox.style.left = `${left}px`;
            selectionBox.style.top = `${top}px`;

            selectionBoxDimensions = {
                x: Math.floor(left * originalImage.scale),
                y: Math.floor(top * originalImage.scale),
                width: Math.floor((moveEvent.target.clientWidth + 2 * moveEvent.target.clientLeft) * originalImage.scale),
                height: Math.floor((moveEvent.target.clientHeight + 2 * moveEvent.target.clientTop) * originalImage.scale)
            }
        }

        function stopSelection(stopEvent) {

            document.onmousemove = null;
            document.onmouseup = null;
            selectionBox.removeEventListener('mouseup', stopSelection);
        }

        document.onmousemove = (event) => moveSelectionBox(event);
        document.onmouseup = (event) => stopSelection(event);
    }
}

function clickResizeHandleSelectionBox(clickEvent) {

    isSelectionResizing = true;
    document.onmousemove = null;

    const pointerX = clickEvent.clientX;
    const pointerY = clickEvent.clientY;

    const rectangle = selectionBox.getBoundingClientRect();

    function resizeSelectionBox(resizeEvent) {

        const newWidth = Math.floor(rectangle.width + resizeEvent.clientX - pointerX);
        const newHeight = Math.floor(rectangle.height + resizeEvent.clientY - pointerY);

        const newSize = newWidth < newHeight ? newWidth : newHeight;

        selectionBox.style.width = `${newSize}px`;
        selectionBox.style.height = `${newSize}px`

        selectionBoxDimensions.width = Math.floor(newSize * originalImage.scale);
        selectionBoxDimensions.height = Math.floor(newSize * originalImage.scale);
    }

    function stopResizingSelectionBox(stopEvent) {

        document.onmousemove = null;
        document.onmouseup = null;
        isSelectionResizing = false;
    }

    document.onmousemove = (event) => resizeSelectionBox(event);
    document.onmouseup = (event) => stopResizingSelectionBox(event);
}