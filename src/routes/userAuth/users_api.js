const express = require("express");
const path = require("path");
const formidable = require("express-formidable");

const usersAPI = express.Router();
usersAPI.use(express.json());

const usersModel = require("../../models/auth/user_model");
const registerTools = require("../../helpers/register_valid_data");
const imageUploadTools = require("../../helpers/upload_image");

usersModel.createUsersTable();

usersAPI.get("/login", (req, res) => {
  if (req.session.userAuthenticated) return res.redirect("/");

  res.sendFile(path.join(__dirname, "../../../public", "pages/login.html"));
})

usersAPI.post("/login-auth", (req, res) => {
  const { usernameOrEmail, password } = req.body;

  usersModel.validUserLogin(usernameOrEmail, password)
    .then((result) => {
      if (!result) {
        return res.status(404).json({error: "user details incorrect", loggedIn: false});
      }

      req.session.user = result[0].dataValues;
      req.session.userAuthenticated = true;

      return res.json({loggedIn: true});
    })
})

usersAPI.get("/current-user-details", (req, res) => {
  if (!req.session.userAuthenticated) return res.sendStatus(401);

  return res.json(
    {
      username: req.session.user.username,
      profileImage: req.session.user.profilePicPath
    }
  )
})

usersAPI.get("/public-user-by-id", (req, res) => {
  if (!req.session.userAuthenticated) return res.sendStatus(401);

  usersModel.getUserById(req.query.user_id)
    .then((result) => {
      res.send({
        id: result[0].dataValues.user_id,
        username: result[0].dataValues.username,
        profilePicPath: result[0].dataValues.profilePicPath
      })
    })
    .catch((err) => res.send(err));
})

usersAPI.get("/logout", (req, res) => {
  if (req.session.userAuthenticated) {
    res.session.user = undefined;
    req.session.userAuthenticated = false;

    res.sendStatus(200);
  }

  res.sendStatus(401);
})

usersAPI.get("/register", (req, res) => {
  if (req.session.userAuthenticated) return res.redirect("/");

  res.sendFile(path.join(__dirname, "../../../public", "pages/register.html"));
})

usersAPI.post("/register-post", formidable({multiples: false}), (req, res) => {
  const uploadedFile = req.files;
  const uploadImageToPath = path.join(__dirname, "../../../public/img/profile_pics/");

  const uploadedImageName = imageUploadTools(uploadImageToPath, uploadedFile.profilePic, 2000*1000);

  if (uploadedImageName == 2) return res.sendStatus(301);

  const profilePicPath = "img/profile_pics/" + uploadedImageName;

  let { email, personName, username, password, dob, agree_register } = req.fields;

  personName = registerTools.validString(personName);

  if (!registerTools.stringsCorrectLength([email, personName, username, password])) return res.sendStatus(301);

  if (!registerTools.dobCheck(dob)) return res.sendStatus(301);

  if (!agree_register) return res.sendStatus(301);

  usersModel.userWithEmailAlreadyExists(email)
    .then((user) => {
      if (user.length > 0) {
        return res.sendStatus(301);
      }

      usersModel.createNewUser(email, personName, username, password, profilePicPath, dob, agree_register)
        .then(() => res.redirect("/login"))
        .catch(() => res.status(501).json({error: "server error!"}));
    })
})



module.exports = usersAPI;