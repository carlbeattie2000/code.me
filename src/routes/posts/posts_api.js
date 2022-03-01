const express = require("express");

const postsAPI = express.Router();

// Posts DB init
const postsModel = require("../../models/posts/posts_model");
const postLikesModel = require("../../models/posts/post_likes_model");
const commentsModel = require("../../models/posts/post_comments_model");

postsModel.createPostsTable();
postLikesModel.createLikesTable();
commentsModel.createCommentsTable();

postsAPI.post("/new-post", express.json(), (req, res) => {
  if (!req.session.userAuthenticated) {
    return res.sendStatus(401);
  }

  const postContent = req.body.content;

  if (Object.values(postContent).length > 0) {
    postsModel.createNewPost(req.session.user.user_id, postContent)
      .finally(res.sendStatus(200))
      .catch((err) => res.status(500).json({error: err}));
  }
})

postsAPI.get("/recent-posts", (req, res) => {
  if (!req.session.userAuthenticated) {
    return res.sendStatus(401);
  }

  postsModel.getAllPosts()
    .then((posts) => {
      const postsDataMin = []
      
      for (let post of posts) {
        postsModel.updatePostsLikeCount(post.dataValues.post_id);
        postsDataMin.push(post.dataValues);
      }

      return res.send(postsDataMin.splice(0, 51).reverse());
    })
    .catch((err) => res.status(500).json({error: err}));
})

postsAPI.get("/like-post", (req, res) => {
  const post_id = req.query.post_id;

  postLikesModel.matchPostIdAndUserId(post_id, req.session.user.user_id)
    .then((result) => {
      if (result.length > 0) {
        return res.status(401);
      }

      postLikesModel.createNewLikedPost(post_id, req.session.user.user_id)
        .then(() => {
          postsModel.updatePostsLikeCount(post_id)
            .then(() => {
              res.status(200);
            })
        });
    })
})

postsAPI.get("/has-liked-post", (req, res) => {
  if (!req.session.userAuthenticated) {
    return res.sendStatus(401);
  }
  
  const post_id = req.query.post_id;

  postLikesModel.matchPostIdAndUserId(post_id, req.session.user.user_id)
    .then((results) => {
      if (results.length > 0) {
        return res.send({liked_post: true})
      }

      return res.send({liked_post: false})
    })
})

module.exports = postsAPI;