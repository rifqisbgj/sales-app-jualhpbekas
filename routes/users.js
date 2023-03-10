const express = require("express");
const router = express.Router();

const usersHandler = require("./handler/users");
const verifyLogin = require("../middleware/verifyUser");
const access = require("../middleware/permission");

// create admin account
router.post("/store", verifyLogin, access("super"), usersHandler.register);
// admin login
router.post("/login", usersHandler.login);
router.get("/token", usersHandler.userToken);
// admin logout
router.post("/logout", usersHandler.logout);
// update data admin
router.put(
  "/edit/:id",
  verifyLogin,
  verifyLogin,
  access("super", "adminQC", "adminSale"),
  usersHandler.update
);
// update password
router.put(
  "/edit-password/:id",
  verifyLogin,
  verifyLogin,
  access("super", "adminQC", "adminSale"),
  usersHandler.editPassword
);
// get data user by id
router.get("/:id", verifyLogin, access("super"), usersHandler.getuser);
// get list user
router.get("/", verifyLogin, access("super"), usersHandler.getListUser);
// delete user
router.delete("/delete", verifyLogin, access("super"), usersHandler.deleteUser);

module.exports = router;
