const sqlite3 = require("sqlite3").verbose();
const postsDatabase = new sqlite3.Database("./database/posts.db");

postsDatabase.serialize(() => {
  postsDatabase.run("CREATE TABLE IF NOT EXISTS posts (id TEXT, posters_id TEXT, post_content TEXT, likes INT, comments_count INT, date_posted TIMESTAMP)");

  postsDatabase.run("CREATE TABLE IF NOT EXISTS likes (post_id TEXT, liker_id TEXT)");

  postsDatabase.run("CREATE TABLE IF NOT EXISTS comments (comment_id TEXT, linked_id TEXT, commenter_id TEXT, likes INT, comment_count INT, date_posted TIMESTAMP)");
})