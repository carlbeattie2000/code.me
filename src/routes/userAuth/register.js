const express = require("express");
const path = require("path");

const registerAuth = express.Router();

const registerHelper = require("../../helpers/register_valid_data");
const registerModel = require("../../models/auth/register_model");

registerAuth.get("/register", (req, res, next) => {
  const options = {
    root: path.join(__dirname, '../../public'),
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
  let { email, personName, username, password, dob, termsAgreed } = req.body;

  personName = registerHelper.validString(personName);
  username = registerHelper.validString(username);
  password = registerHelper.validString(password);

  if (!registerHelper.stringsCorrectLength([email, personName, username]))
    return false
  
  if (!registerHelper.dobCheck(dob))
    return false
  
  if (!termsAgreed)
    return false

  registerModel.checkIfUserAlreadyExists(email, (status) => {
    if (status) {
      return res.send({register_complete: false})
    }

    if (
      registerModel.newUser(
      email, personName, username, password, dob, termsAgreed)) {
      return res.send({register_complete: true});
    }
  });
})

module.exports = registerAuth;