const sqlite3 = require("sqlite3").verbose();
const crypto = require("crypto");
const hashingFunctions = require("../../helpers/hashing");

const usersDatabase = new sqlite3.Database("./database/accounts.db");

const checkIfUserAlreadyExists = async (email, cb) => {
 usersDatabase.all("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
   if (rows.length > 0) return cb(true)

   return cb(false)
 })
}

const newUser = async (email, name, username, password, dob, termsAgree) => {
  const customHashSalt = crypto.randomBytes(16).toString("hex");
  const hashedPassword = hashingFunctions.hashStringWithCustomSalt(
    password, customHashSalt);
  const generatedAccountID = crypto.randomBytes(12).toString("hex");

  const sqlQuery = usersDatabase.prepare("INSERT INTO users VALUES (?, ?, ?, ?, ?, ?, ?, ?)");

  sqlQuery.run(generatedAccountID, email, name, username, hashedPassword, dob, termsAgree, customHashSalt);

  sqlQuery.finalize();

  return true
}

module.exports = {
  checkIfUserAlreadyExists,
  newUser,
}