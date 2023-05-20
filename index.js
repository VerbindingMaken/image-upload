

const fileInput = document.querySelector(".image-upload__input")
const uploadButton = document.querySelector(".image-upload__upload-button");

uploadButton.addEventListener('click', selectImageForUpload);
fileInput.addEventListener('chabge', onFileSelected);


function selectImageForUpload() {
    fileInput.click();
}

function onFileSelected(event) {
    const file = event.target.files[0];
    const fileName = file.name;
    const fileSize = Math.floor(file.size / 1024);
    console.log("Name and size: ", fileName, fileSize)
}