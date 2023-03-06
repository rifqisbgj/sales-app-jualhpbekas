const register = require("./createUser");
const login = require("./login");
const update = require("./editprofile");
const getuser = require("./getUser");
const getListUser = require("./getListUser");
const logout = require("./logout");
const editPassword = require("./editPassword");
const userToken = require("./userToken");

module.exports = {
  register,
  login,
  update,
  getuser,
  getListUser,
  logout,
  editPassword,
  userToken,
};
