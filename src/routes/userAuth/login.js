const express = require("express");
const path = require("path");

const loginAuth = express.Router();

const loginAuthFunctions = require("../../helpers/loginAuthFunctions");
const getUsersModel = require("../../models/auth/get_users_details");

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

    return res.send({login_response: "success", login_complete: true})
  });
})

loginAuth.get("/public-user-by-id", (req, res) => {
  if (req.session.userAuthenticated) {
    getUsersModel.getUserById(req.query.user_id, (result) => {
      if (Object.values(result).length > 0) {
        return res.send(result);
      }
  
      return res.send({error: result, message: "no user found"});
    })
  } else {
    return res.sendStatus(401);
  }
})

module.exports = loginAuth;