

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


    image.addEventListener('load', function () {
        const imageHeight = image.naturalHeight;
        const imageWidth = image.naturalWidth;
        console.log(image, 'Height: ', imageHeight, 'Widht: ', imageWidth)

    })


    image.src = imagePath;
    image.style.maxWidth = '300px';
    image.style.maxHeight = '300px';

    while (imageFrame.lastElementChild) {
        imageFrame.removeChild(imageFrame.lastElementChild)
    }

    imageFrame.appendChild(image);
}