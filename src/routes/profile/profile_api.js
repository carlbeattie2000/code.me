const express = require("express");

const profileAPI = express.Router();

const userModel = require("../../models/auth/user_model");
const usersFollowersModel = require("../../models/auth/user_following_model");
const postsModel = require("../../models/posts/posts_model");
const likesModel = require("../../models/posts/post_likes_model");

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

profileAPI.get("/recommended_followers", (req, res) => {
  // Just a quick throw up to see how i want it to sort of work
  // WILL BE CHANGED ASAP
  if (!req.session.userAuthenticated) {
    return res.sendStatus(401);
  }

  const findUsersToFollow = async () => {
    const postsUserHasLikedIds = await likesModel.findLikesByUserId(req.session.user.user_id);

    const posts = [];

    for (let postId of postsUserHasLikedIds) {
      posts.push(await postsModel.getPostById(postId.dataValues.post_id));
    }

    const filterPostByUser = await posts.filter((post) => {
      if ((post[0].dataValues.posters_id == req.session.user.user_id) == false) {
        return post;
      }
    })

    const followingList = await usersFollowersModel.getUsersFollowingList(req.session.user.user_id);
    const followingListIds = [];
    await followingList.forEach(follower => followingListIds.push(follower.dataValues.account_following_id))

    const filterPostByUsersUserAlreadyFollows = await filterPostByUser.filter((post) => {
      if (!followingListIds.includes(post[0].dataValues.posters_id)) {
        return post
      }
    })

    const recommendedUsersOccurCount = {};

    filterPostByUsersUserAlreadyFollows.forEach((post) => {
      if (recommendedUsersOccurCount.hasOwnProperty(post[0].dataValues.posters_id)) {
        recommendedUsersOccurCount[post[0].dataValues.posters_id]++;
      } else {
        recommendedUsersOccurCount[post[0].dataValues.posters_id] = 1;
      }
    })

    let ids = [];
    let orderedIds = [];

    for (let key of Object.keys(recommendedUsersOccurCount)) {
      ids.push({ [key]: recommendedUsersOccurCount[key] });
    }

    let prevValue = 0;

    for (let id of ids) {
      if (Object.values(id)[0] > prevValue) {
        orderedIds.unshift(id);
      }
    }

    const foundUsers = [];

    for (let id of orderedIds) {
      for (let key of Object.keys(id)) {
        foundUsers.push(await userModel.getUserByIdOrUsername(key));
      }
    }

    // if no users are found, the next step of the algo is to search repeat the search on someone the user is already following and using there results for this user, and basically repeat the step until we find someone, but of course the deeper we go, the more likely the account to recommend wont be a great match.

    // The algo will also search for accounts that have the same interests, or popular accounts, that will be recommend sometimes. Have not figured out what the variable will be for deciding if this algo is used. Most likely will be if no users can be found when using the above one, or x amount of time has pass since last use of it.

    // The same kinda algo can be used to display featured/recommend posts/ads

    return foundUsers;
  }

  findUsersToFollow().then((x) => res.send(x));

})

module.exports = profileAPI;