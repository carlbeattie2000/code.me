const sqlite3 = require("sqlite3").verbose();
const usersDatabase = new sqlite3.Database("./database/accounts.db");

// Create default users table

usersDatabase.serialize(() => {
  usersDatabase.run("CREATE TABLE IF NOT EXISTS users (id TEXT, email TEXT, name TEXT, username TEXT, password TEXT, profilePicPath TEXT, dateOfBirth DATE, confirmedCorrectAge BOOl, passwordSalt TEXT)");
})