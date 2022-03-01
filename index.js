// TODO: 
// 1. When user has already liked a post and clicks the like button, unlike that post -- WORKING ON
// 2. Show the if the user has already liked a post --> DONE
// 3. User profile
// 4. Post page, with comments
// 5. Move to frontend framework

const express = require("express");
const path = require("path");

const PORT = process.env.PORT || 4001;
const app = express();

const usersAPI = require("./src/routes/userAuth/users_api");
const postsAPI = require("./src/routes/posts/posts_api");

app.use(express.static('public'));
app.use(require('cookie-parser') ());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session') ({ 
  secret: 'dhye7#fhfy!7dh',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000*60*60*24
  }
 }));
 
app.use("/", postsAPI);
app.use("/", usersAPI);

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