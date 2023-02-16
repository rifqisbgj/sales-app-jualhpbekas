const express = require("express");
const router = express.Router();
const merekHandler = require("./handler/merek");

/* GET users listing. */
router.post("/store", merekHandler.tambahMerek);

module.exports = router;
