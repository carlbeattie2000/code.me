const sqlite3 = require("sqlite3").verbose();

const usersDatabase = new sqlite3.Database("./database/accounts.db");

const getUserById = (userID, cb) => {
  const getUserByIdQuery = usersDatabase.get("SELECT id, name, username, profilePicPath FROM users WHERE id = ?", [userID], (err, row) => {
    if (err) return cb(err);

    return cb(row || {});
  })
}

module.exports = {
  getUserById,
}