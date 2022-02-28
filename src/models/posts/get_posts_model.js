const sqlite3 = require("sqlite3").verbose();

const postsDatabase = new sqlite3.Database("./database/posts.db");
const usersDatabase = new sqlite3.Database("./database/accounts.db");

// Find post's algorithm, find post's from friends followed, then trending posts, and post's that relate to the users followings. for now let's just use the 50 most recent post's

const getRecentPosts = (cb) => {
  const getRecentPostsQuery = postsDatabase.all("SELECT * FROM posts", (err, rows) => {
    if (err) return cb(err);

    return cb(rows);
  });
}

const getPostsByUserId = (userID, cb) => {
  const getPostsByUserIdQuery = postsDatabase.all("SELECT * FROM posts WHERE posters_id = ?", [userID], (err, rows) => {
    if (err) return cb(err);

    return cb(rows);
  })
}

module.exports = {
  getRecentPosts,
  getPostsByUserId,
}