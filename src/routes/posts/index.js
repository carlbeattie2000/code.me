const getPosts = require("./get_posts");
const newPosts = require("./new_posts");

const databaseInit = require("./sql3_init");

module.exports = {
  getPosts,
  newPosts
}