const express = require("express");
const router = express.Router();

const usersHandler = require("./handler/users");

// create admin account
router.post("/store", usersHandler.register);
// admin login
router.post("/login", usersHandler.login);
// admin logout
router.post("/logout", usersHandler.logout);
// update data admin
router.put("/edit/:id", usersHandler.update);
// update password
router.put("/edit-password/:id", usersHandler.editPassword);
// get data user by id
router.get("/:id", usersHandler.getuser);
// get list user
router.get("/", usersHandler.getListUser);

module.exports = router;
