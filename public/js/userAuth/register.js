const registerButton = document.getElementById("auth_register");

registerButton.addEventListener("click", () => {
  sendRegisterDetails(getRegisterFormDataInJson()).then((res) => {
    if (res.register_complete) return window.location.href = "/login"
    // window.location.href = "/login";
  });
})

const getRegisterFormDataInJson = () => {
  let email = document.getElementById("email_register").value;
  let personName = stringValid(document.getElementById("name_register").value);
  let username = stringValid(document.getElementById("username_register").value);
  let password = stringValid(document.getElementById("password_register").value);
  let dob = document.getElementById("dob_register").value;
  let termsAgreed = document.getElementById("terms_agree").checked;

  if (!stringsCorrectLength([personName, username, password], 3, 16))
    return false

  if (!dobCheck(dob))
    return false

  if (!termsAgreed)
    return false

  return ({
    email,
    personName,
    username,
    password,
    dob,
    termsAgreed
  })
}

const dobCheck = (dob) => {
  const date = new Date();

  const currentYearMinYear = (parseInt(date.getFullYear()) - 13);
  const userBirthYear = parseInt(dob.split("-")[0])
  
  if (userBirthYear > currentYearMinYear) {
    return false
  }

  return true
}

const stringsCorrectLength = (strings, minLength, maxLength) => {
  for (let string of strings) {
    if (string.length < minLength || string.length > maxLength) {
      return false
    }
  }
  return true
}

const stringValid = (string) => {
  string = string.replace(/^[0-9]/ig, "");

  string = string.replace(/[!"£$%^&*()-/.,?<>;'#:@~|]/ig, "");

  return string
}



const sendRegisterDetails = async (data) => {
  if (!data)
    return false

  const url = "http://192.168.0.3:4001/register-post";

  const sendDetails = await fetch(url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      'Content-Type': 'application/json'
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify(data)
  })

  return sendDetails.json();
}

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