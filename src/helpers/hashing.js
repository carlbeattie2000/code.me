const crypto = require("crypto");

const hashStringWithCustomSalt = (string, salt) => {
  return crypto.pbkdf2Sync(string, salt, 1000, 64, 'sha512').toString("hex");
}

module.exports = {
  hashStringWithCustomSalt
}