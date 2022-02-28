const express = require("express");
const crypto = require("crypto");

const newPostAPI = express.Router();
const newPostModel = require("../../models/posts/new_post_model");

newPostAPI.post("/new-post", (req, res) => {
  if (!req.session.userAuthenticated) {
    return res.send({error_message: "You must be logged into to upload a post!"});
  }
  
  const postContent = req.body.content;

  if (Object.values(postContent).length > 0) {
    newPostModel.uploadNewPost({
      postID: crypto.randomBytes(10).toString("hex"),
      posterID: req.session.user.id,
      postContent: postContent,
      timePosted: Math.floor(Date.now()/1000)
    });

    return res.send({message: "your post was uploaded successfully"});
  }

  res.send({message: "you must be signed in to post"});
})

module.exports = newPostAPI;