const sqlite3 = require("sqlite3").verbose();

const postsDatabase = new sqlite3.Database("./database/posts.db");

const uploadNewPost = async (postData) => {
  const { postID, posterID, postContent, timePosted } = postData;

  const uploadPostSqlQuery = postsDatabase.prepare("INSERT INTO posts VALUES (?, ?, ?, ?, ?, ?)");

  uploadPostSqlQuery.run(postID, posterID, postContent, 0, 0, timePosted);

  uploadPostSqlQuery.finalize();

  return true;
}

module.exports = {
  uploadNewPost,
}