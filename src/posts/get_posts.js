const express = require("express");

const getPostsAPI = express.Router();
const getPostsModel = require("../models/posts/get_posts_model");

getPostsAPI.get("rpp", (req, res) => {
  getPostsModel.getRecentPosts((response) => {
    return res.send(response.slice(0, 51));
  });

  return res.send({error: "no posts found"});
})

getPostsAPI.get("/recent-posts", (req, res) => {
  if (req.session.userAuthenticated) {
    getPostsModel.getRecentPosts((response) => {
      if (response.length > 0) return res.send(response.slice(0, 51).reverse());
  
      return res.send({error: "no posts found"});
    })
  } else {
    res.send({error: "must be logged in"});
  }
})

module.exports = getPostsAPI;