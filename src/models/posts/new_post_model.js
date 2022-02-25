const sqlite3 = require("sqlite3").verbose();

const postsDatabase = new sqlite3.Database("./database/posts.db");

const uploadNewPost = async (postData) => {
  
}