const express = require("express");
const crypto = require("crypto");

const newPostAPI = express.Router();
const newPostModel = require("../models/posts/new_post_model");

newPostAPI.post("/new-post", (req, res) => {
  if (!req.session.userAuthenticated) {
    return res.send({error_message: "You must be logged into to upload a post!"});
  }
  
  const postContent = req.body;

  const newPost = {
    postID: crypto.randomBytes(10).toString("hex"),
    posterID: req.session.user.id,
    postContent: postContent,
    likes: 0,
    commentCount: 0,
    timePosted: Math.floor(Date.now()/1000)
  }

  
})

module.exports = newPostAPI;