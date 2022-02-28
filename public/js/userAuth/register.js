// handle custom file upload button
const fileUploadBtn = document.getElementById("file-upload-btn");
const selectedFileDisplay = document.getElementById("file-selected");

fileUploadBtn.addEventListener("change", (e) => {
  const validFileExtensions = ["png", "jpeg", "jpg"];
  const LoadedFile = e.target.files[0];
  const splitSelectedFileText = LoadedFile.name.split(".");
  const selectedFileExtension = splitSelectedFileText[splitSelectedFileText.length - 1];
  const maxImageSizeInBytes = 1200000

  if (!validFileExtensions.includes(selectedFileExtension.toLowerCase())) {
    selectedFileDisplay.textContent = "Invalid File Type!";
    e.target.files = [];
    return;
  }
  
  if (LoadedFile.size > maxImageSizeInBytes) {
    selectedFileDisplay.textContent = "Image size exceeds limit!";
    e.target.files = [];
    return;
  }

  console.log(LoadedFile.size);
  selectedFileDisplay.textContent = LoadedFile.name;
})