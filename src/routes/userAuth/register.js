const express = require("express");
const path = require("path");
const formidable = require("express-formidable");

const registerAuth = express.Router();

registerAuth.use(formidable({
  multiples: false
}));

const registerHelper = require("../../helpers/register_valid_data");
const uploadImageHelper = require("../../helpers/upload_image");
const registerModel = require("../../models/auth/register_model");

registerAuth.get("/register", (req, res, next) => {
  const options = {
    root: path.join(__dirname, '../../../public'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    }
  }

  res.sendFile("/pages/register.html", options, (err) => {
    if (err) {
      next(err);
    }
  })
})

registerAuth.post("/register-post", (req, res) => {
  const file = req.files;
  const uploadImagePath = path.join(__dirname, "../../../public/img/profile_pics/");

  const uploadedImageName = uploadImageHelper(uploadImagePath, file.profilePic, 2000*1000);

  if (uploadedImageName == 2) {
    return res.status(301).sendFile(path.join(__dirname, "../../../public/pages/register.html"));
  }

  const profilePicPath = "img/profile_pics/"+uploadedImageName;

  let {email, personName, username, password, dob, agree_register} = req.fields;

  personName = registerHelper.validString(personName);
  username = registerHelper.validString(username);
  password = registerHelper.validString(password);

  if (!registerHelper.stringsCorrectLength([email, personName, username]))
    return false
  
  if (!registerHelper.dobCheck(dob))
    return false
  
  if (!agree_register)
    return false

  registerModel.checkIfUserAlreadyExists(email, (status) => {
    if (status) {
      return res.send({register_complete: false})
    }

    if (
      registerModel.newUser(
      email, personName, username, password, profilePicPath, dob, agree_register)) {
      return res.redirect("/login");
    }

    res.status(501).json({error: "server error!"});
  });
})

module.exports = registerAuth;