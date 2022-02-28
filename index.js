// TODO
// 1. CLEAN CODE (REMOVE CONSOLE LOGS) --> DONE
// 2. PROFILE PICS NEED TO BE ABLE TO BE UPLOADED
// 3. POSTS DISPLAYED NEED TO SHOW LIKE COUNT, COMMENT COUNT AND TIME SINCE POSTED
// 4. ADD ROUTES FOLDERS TO ROUTES FOLDER!! AND UPDATE ANY PATHS THAT NEED TO BE UPDATED

const express = require("express");
const cors = require("cors");

const path = require("path");
const PORT = process.env.PORT || 4001;
const app = express();

const userAuthentication = require("./src/routes/userAuth");
const postsAPI = require("./src/routes/posts");

app.use(cors());
app.use(express.static('public'));
app.use(require('cookie-parser') ());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(express.json());
app.use(require('express-session') ({ 
  secret: 'dhye7#fhfy!7dh',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000*60*60*24
  }
 }));

// Can i clean these up?
app.use("/", userAuthentication.loginAPI);
app.use("/", userAuthentication.registerAPI);
app.use("/", postsAPI.getPosts);
app.use("/", postsAPI.newPosts); 

app.get("/", (req, res, next) => {
  if (!req.session.userAuthenticated) {
    return res.redirect("/login")
  }
  
  const options = {
    root: path.join(__dirname, 'public'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    }
  }

  res.sendFile("/pages/index.html", options, (err) => {
    if (err) {
      next(err);
    }
  })
})

app.get("/pp", (req, res, next) => {
  const options = {
    root: path.join(__dirname, 'public'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    }
  }

  res.sendFile("/pages/public_profile.html", options, (err) => {
    if (err) {
      next(err);
    }
  })
})

app.get("/pv", (req, res, next) => {
  const options = {
    root: path.join(__dirname, 'public'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
    }
  }

  res.sendFile("/pages/post_view.html", options, (err) => {
    if (err) {
      next(err);
    }
  })
})

app.listen(PORT, () => {
  console.log(`Server now running on http://192.168.0.3:${PORT}`);
})