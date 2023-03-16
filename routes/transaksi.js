const express = require("express");
const router = express.Router();
const transaksiHandler = require("./handler/transaksi");

const verifyLogin = require("../middleware/verifyUser");
const access = require("../middleware/permission");

// Store new transaksi
router.post(
  "/store",
  verifyLogin,
  access("super", "adminSale"),
  transaksiHandler.createTransaksi
);
// // get all transaksi
router.get(
  "/",
  verifyLogin,
  access("super", "adminSale"),
  transaksiHandler.getAllTransaksi
);
// // get detail transaksi
router.get(
  "/detail/:invoice",
  verifyLogin,
  access("super", "adminSale"),
  transaksiHandler.getDetailTransaksi
);

module.exports = router;
