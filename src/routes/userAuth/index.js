const loginAPI = require("./login");
const registerAPI = require("./register");

const usersDatabaseInit = require("./sql3_init");

module.exports = {
  loginAPI,
  registerAPI
}