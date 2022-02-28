
const sqlite3 = require("sqlite3");
const hashingFunctions = require("./hashing");

const usersDatabase = new sqlite3.Database("./database/accounts.db");

const userValidLogin = (usernameOrEmail, password, cb) => {
  usersDatabase.all("SELECT * FROM users WHERE username = ? OR email = ?", [usernameOrEmail, usernameOrEmail], (error, results) => {

    if (error)
      return cb(2)
    
    if (results.length == 0)
      return cb(3)
    
    const isValid = validPassword(password, results[0].password, results[0].passwordSalt);

    const user = {id: results[0].id, username: results[0].username, hashedPassword: results[0].password, passwordSalt: results[0].passwordSalt};

    if (isValid) {
      return cb(user)
    }

    return cb(3)
  })
}

const validPassword = (password, hashedPassword, originalSalt) => {
  const passedInPasswordHashed = hashingFunctions.hashStringWithCustomSalt(password, originalSalt);

  if (passedInPasswordHashed == hashedPassword) return true

  return false
}

module.exports = userValidLogin;