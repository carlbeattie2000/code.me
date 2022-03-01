const express = require("express");

const profileAPI = express.Router();

const userModel = require("../../models/auth/user_model");
const usersFollowersModel = require("../../models/auth/user_following_model");
const postsModel = require("../../models/posts/posts_model");

/* 
  Details that will be sent to public profile page
  username, name
  posts count
  Joined Date
  following count
  followers count
  list of posts
  profile image
  
  to add later ->
    banner image
    profile bio
*/
profileAPI.get("/profile", (req, res) => {
  if (!req.session.userAuthenticated) return res.sendStatus(401);

  const profile_query = req.query.profile_query;

  if (!profile_query) return res.sendStatus(400);

  userModel.getUserByIdOrUsername(profile_query)
    .then((user) => {
      if (user.length > 0) {
        const userToSend = user[0].dataValues;
        usersFollowersModel.getAccountFollowersAmount(userToSend.user_id)
          .then((followers) => {
            userToSend.followers = followers;

            usersFollowersModel.getAccountFollowingAmount(userToSend.user_id)
              .then((following) => {
                userToSend.following = following;

                postsModel.getAllPostsByPostersId(userToSend.user_id)
                  .then(posts => {
                    userToSend.posts_count = posts.length;
                    userToSend.posts = posts.reverse();

                    return res.send(userToSend);
                  })
              })
          })
      } else {
        return res.sendStatus(404);
      }
    })
    .catch(err => res.sendStatus(500));
})

module.exports = profileAPI;