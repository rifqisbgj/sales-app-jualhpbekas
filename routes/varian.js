const express = require("express");
const router = express.Router();
const varianHandler = require("./handler/varian");

const verifyLogin = require("../middleware/verifyUser");
const access = require("../middleware/permission");

// store new varian
router.post("/store", verifyLogin, access("super"), varianHandler.createVarian);
router.put(
  "/update/:id",
  verifyLogin,
  access("super"),
  varianHandler.updateVarian
);
// get all varian with brand name
router.get("/", varianHandler.getAllVarians);
// detail varian with product list
router.get("/detail/:id", varianHandler.detailVarian);
// detail for edit varian
router.get("/edit/:id", varianHandler.getVarian);
// get varian by brand
router.get("/viewbybrand/:id", varianHandler.getVarianByBrand);
// delete varian
router.delete(
  "/delete",
  verifyLogin,
  access("super"),
  varianHandler.deleteVarian
);

module.exports = router;
