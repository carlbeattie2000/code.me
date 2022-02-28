const fs = require("fs");
const path = require("path");
const crypto = require("crypto")

// uploads image to the server, and then returns the new images file name
const uploadImageToServerStorage = (uploadImageToPath, file, maxImageSize) => {
  const imageFileNameSplit = file.name.split(".");
  const imageExtension = imageFileNameSplit[imageFileNameSplit.length - 1];

  const newFileName = crypto.randomBytes(16).toString("hex") + "." + imageExtension;

  if (file.size > maxImageSize) {
    return 2
  }

  fs.writeFileSync(uploadImageToPath+newFileName, fs.readFileSync(file.path));

  return newFileName;
}

module.exports = uploadImageToServerStorage;