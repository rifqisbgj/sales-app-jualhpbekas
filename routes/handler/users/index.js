const register = require("./createUser");
const login = require("./login");
const update = require("./editprofile");
const getuser = require("./getUser");
const getListUser = require("./getListUser");
const logout = require("./logout");
const editPassword = require("./editPassword");
const userToken = require("./userToken");
const deleteUser = require("./deleteUser");

module.exports = {
  register,
  login,
  update,
  getuser,
  getListUser,
  logout,
  editPassword,
  userToken,
  deleteUser,
};
