const express = require("express");
const router = express.Router();
const logHandler = require("./handler/log");

const verifyLogin = require("../middleware/verifyUser");
const access = require("../middleware/permission");

// // get all transaksi
router.get("/", verifyLogin, access("super"), logHandler.getListLog);
module.exports = router;
