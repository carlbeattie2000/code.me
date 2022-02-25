const express = require("express");
const path = require("path");

const loginAuth = express.Router();

const loginAuthFunctions = require("../helpers/loginAuthFunctions");

loginAuth.get("/login", (req, res, next) => {
  if (req.session.userAuthenticated) {
    return res.redirect("/");
  }

  const options = {
    root: path.join(__dirname, '../../public'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    }
  }

  res.sendFile("/pages/login.html", options, (err) => {
    if (err) {
      next(err);
    }
  })
})

loginAuth.post("/login-auth", (req, res) => {
  const { usernameOrEmail, password } = req.body;

  loginAuthFunctions(usernameOrEmail, password, (status) => {
    if (status == 2) {
      return res.send({login_response: "Server error"})
    }

    if (status == 3) {
      return res.send({login_response: "Login details wrong"})
    }

    req.session.user = status;
    req.session.userAuthenticated = true;

    console.log(req.session);

    return res.send({login_response: "success", login_complete: true})
  });
})

module.exports = loginAuth;