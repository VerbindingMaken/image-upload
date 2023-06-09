
// Input for:           upload image file
const fileInput = document.querySelector(".image-upload__input")
const uploadButton = document.querySelector(".image-upload__dropzone-button");
const dropZone = document.querySelector('.image-upload__dropzone');

// Event listeners for:  upload image file
fileInput.addEventListener('change', handleFileInput);
uploadButton.addEventListener('click', selectImageForUpload);


window.addEventListener('dragenter', handleFileDrag, false);
window.addEventListener("dragover", handleFileDrag);
window.addEventListener("drop", handleFileDrop);

dropZone.ondragleave = () => removeDragStyling();

// Elements for             canvas and selection
const canvasFrame = document.querySelector('.image-edit-canvas-frame');
const selectionBox = document.querySelector('.image-edit__selection-box');
const resizeHandleSelectionBox = document.querySelector('.image-edit__resize-handle-selection-box');

// Event listeners for      canvas and selection
selectionBox.addEventListener('dragstart', () => false);
selectionBox.addEventListener('mousedown', clickSelectionBox);
resizeHandleSelectionBox.addEventListener('mousedown', clickResizeHandleSelectionBox);
resizeHandleSelectionBox.addEventListener('dragstart', () => false);

// Buttons for:             edit and save actions
const downloadButton = document.querySelector('.image-edit__download-button');
const cropButton = document.querySelector('.image-edit__crop-button');
const resetButton = document.querySelector('.image-edit__reset-button');

// Event listeners for:     edit and save actions
cropButton.addEventListener('click', cropImage);
resetButton.addEventListener('click', resetImage);
downloadButton.addEventListener('click', downloadImage);


// Image canvas
const canvas = document.querySelector('.image-edit__canvas');
const canvasContext = canvas.getContext("2d");

// State
let isImageLoaded = false;
let isSelectionResizing = false

let originalImage = {
    name: "",
    size: 0,
    width: 0,
    height: 0,
    scale: 0,
    displayWidth: 0,
    displayHeight: 0,
    element: null
}

let selectionBoxDimensions;

function stopDefault(event) {
    event.preventDefault();
    event.stopPropagation();
}

// File input
function selectImageForUpload() {

    fileInput.click();
}

function handleFileInput(event) {

    const file = event.target.files[0];

    displayImage(file);
}

// File drag 'n drop
function handleFileDrag(event) {

    stopDefault(event);

    const className = event.target.className;

    if (className.indexOf("image-upload__dropzone") === -1) {

        event.dataTransfer.effectAllowed = "none";
        event.dataTransfer.dropEffect = "none";
    }
    else {

        dropZone.classList.add("image-upload__drag-over-dropzone");
    }

}

function handleFileDrop(event) {

    stopDefault(event);

    const className = event.target.className;

    if (className.indexOf("image-upload__dropzone") === -1) {

        event.dataTransfer.effectAllowed = "none";
        event.dataTransfer.dropEffect = "none";
    }
    else {

        removeDragStyling();

        const data = event.dataTransfer;
        const file = data.files[0];
        const type = file.type;

        if (type === "image/jpeg" || type === "image/png") {
            displayImage(file);
        }
    }
}

function removeDragStyling() {

    dropZone.classList.remove("image-upload__drag-over-dropzone");
}

function setCanvas(originalImage) {
    // Reset canvas-frame size
    canvasFrame.style.width = '';
    canvasFrame.style.height = '';

    // Set canvas width
    const width = originalImage.element.naturalWidth;
    const height = originalImage.element.naturalHeight;

    canvas.width = originalImage.width = width;
    canvas.height = originalImage.height = height;

    // Set dimensions for display
    if (canvas.width >= canvas.height && canvas.width > 300) {
        originalImage.displayWidth = 300;
        const ratio = width / height
        const heightFromRatio = Math.floor(300 / ratio);
        originalImage.displayHeight = heightFromRatio;

        originalImage.scale = width / 300;
    }
    else if (canvas.height >= canvas.width && canvas.height > 300) {
        const ratio = height / width;
        const widthFromRatio = Math.floor(300 / ratio);
        originalImage.displayWidth = widthFromRatio
        originalImage.displayHeight = 300;

        originalImage.scale = height / 300;
    }
    else {
        originalImage.displayWidth = canvas.width;
        originalImage.displayHeight = canvas.height;

        originalImage.scale = 1;
    }

    canvasFrame.style.width = `${originalImage.displayWidth}px`;
    canvasFrame.style.height = `${originalImage.displayHeight}px`;

    canvas.style.maxWidth = '300px';
    canvas.style.maxHeight = '300px';

    // Draw canvas
    canvasContext.drawImage(originalImage.element, 0, 0, originalImage.width, originalImage.height);
}

function setSelectionBox() {

    selectionBoxDimensions = {
        x: 0,
        y: 0,
        width: 100,
        height: 100
    }

    // Set SelectionBox dimensions for display;
    selectionBox.style.top = selectionBoxDimensions.y;
    selectionBox.style.left = selectionBoxDimensions.x;
    selectionBox.style.width = `${selectionBoxDimensions.width}px`;
    selectionBox.style.height = `${selectionBoxDimensions.height}px`;

    selectionBox.style.display = "block";
    resizeHandleSelectionBox.style.display = "block";
}

// Set canvas
function displayImage(imageFile) {

    originalImage.element = new Image();

    const name = imageFile.name;
    const index = name.lastIndexOf('.');
    originalImage.name = name.slice(0, index);
    originalImage.size = imageFile.size;

    const imagePath = URL.createObjectURL(imageFile);
    originalImage.element.src = imagePath;

    function setCanvasAndSelectionBox() {
        setCanvas(originalImage);
        setSelectionBox();

        isImageLoaded = true;

        originalImage.element.removeEventListener('load', setCanvasAndSelectionBox);
    }

    originalImage.element.addEventListener('load', setCanvasAndSelectionBox);
}

// Move selection box
function clickSelectionBox(clickEvent) {

    stopDefault(clickEvent);

    const rectangle = canvas.getBoundingClientRect();


    if (!isSelectionResizing) {

        const offsetX = clickEvent.offsetX;
        const offsetY = clickEvent.offsetY;

        function moveSelectionBox(moveEvent) {

            stopDefault(moveEvent);

            // Calculate left and top postion of selectionBox, relative to canvas,` based on mouse movement
            let left = Math.floor((moveEvent.clientX - offsetX) - rectangle.left);
            let top = Math.floor((moveEvent.clientY - offsetY) - rectangle.top);

            // Keep selectionbox inside canvas boundaries
            if (left <= 0) {
                left = 0;
            }
            if ((left + selectionBoxDimensions.width) >= originalImage.displayWidth) {
                left = (originalImage.displayWidth - selectionBoxDimensions.width);
            }
            if (top <= 0) {
                top = 0;
            }
            if ((top + selectionBoxDimensions.height) >= originalImage.displayHeight) {
                top = (originalImage.displayHeight - selectionBoxDimensions.height)
            }


            // Set selectionbox position
            selectionBox.style.left = `${left}px`;
            selectionBox.style.top = `${top}px`;

            selectionBoxDimensions.x = left;
            selectionBoxDimensions.y = top;

        }

        function stopSelection() {

            document.onmousemove = null;
            document.onmouseup = null;
            selectionBox.removeEventListener('mouseup', stopSelection);
        }

        document.onmousemove = (event) => moveSelectionBox(event);
        document.onmouseup = () => stopSelection();
    }
}

// Resize selection box
function clickResizeHandleSelectionBox(clickEvent) {

    stopDefault(clickEvent);

    isSelectionResizing = true;
    document.onmousemove = null;

    const clientX = clickEvent.clientX;
    const clientY = clickEvent.clientY;

    const rectangle = selectionBox.getBoundingClientRect();

    function resizeSelectionBox(resizeEvent) {

        stopDefault(resizeEvent);

        // Calculate width and height of selctionbox based on mousemovement
        let newWidth = Math.floor(rectangle.width + resizeEvent.clientX - clientX);
        let newHeight = Math.floor(rectangle.height + resizeEvent.clientY - clientY);

        // Keep selectionBox dimensions inside canvas boundaries
        if ((selectionBoxDimensions.x + newWidth) >= originalImage.displayWidth) {
            newWidth = (originalImage.displayWidth - selectionBoxDimensions.x);
        }
        if ((selectionBoxDimensions.y + newHeight) >= originalImage.displayHeight) {
            newHeight = (originalImage.displayHeight - selectionBoxDimensions.y);
        }

        const newSize = newWidth < newHeight ? newWidth : newHeight;

        // Set new selectionbox width and height
        selectionBox.style.width = `${newSize}px`;
        selectionBox.style.height = `${newSize}px`

        selectionBoxDimensions.width = newSize;
        selectionBoxDimensions.height = newSize;
    }

    function stopResizingSelectionBox() {

        document.onmousemove = null;
        document.onmouseup = null;
        isSelectionResizing = false;
    }

    document.onmousemove = (event) => resizeSelectionBox(event);
    document.onmouseup = () => stopResizingSelectionBox();
}

// Image edit and save actions
function resizeImage(x, y, width, heigth) {

    if (isImageLoaded) {

        // Draw canvas
        canvas.width = width;
        canvas.height = heigth;

        canvasContext.drawImage(
            originalImage.element,
            x,
            y,
            width,
            heigth,
            0,
            0,
            width,
            heigth
        );

        // Set dimeninsion for display
        if (canvas.width > 300) {
            canvasFrame.style.width = '300px';
            canvasFrame.style.height = '300px';
        }
        else {
            canvasFrame.style.width = `${canvas.width}px`;
            canvasFrame.style.height = `${canvas.height}px`;
        }

        canvas.style.maxWidth = '300px';
        canvas.style.maxHeight = '300px';
    }
}

function cropImage() {

    const scaledX = selectionBoxDimensions.x * originalImage.scale;
    const scaledY = selectionBoxDimensions.y * originalImage.scale;
    const scaledWith = selectionBoxDimensions.width * originalImage.scale;
    const scaledHeight = selectionBoxDimensions.height * originalImage.scale;

    resizeImage(
        scaledX,
        scaledY,
        scaledWith,
        scaledHeight
    )

    selectionBox.style.display = "none";
    resizeHandleSelectionBox.style.display = "none";
}

function resetImage() {

    setCanvas(originalImage);
    setSelectionBox();
}

function downloadImage() {

    if (isImageLoaded) {
        const temporaryLink = document.createElement('a');

        const pixelWidth = selectionBoxDimensions.width * originalImage.scale;
        const pixelHeight = selectionBoxDimensions.height * originalImage.scale;

        temporaryLink.download = `${originalImage.name}-${pixelWidth}-${pixelHeight}.jpg`;
        temporaryLink.href = canvas.toDataURL("image/jpeg", 1);

        temporaryLink.click();
    }
}