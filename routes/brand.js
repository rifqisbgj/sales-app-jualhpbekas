const express = require("express");
const router = express.Router();
const brandHandler = require("./handler/brand");

const verifyLogin = require("../middleware/verifyUser");
const access = require("../middleware/permission");

// Store new brand
router.post("/store", verifyLogin, access("super"), brandHandler.createBrand);
// update a brand
router.put(
  "/update/:id",
  verifyLogin,
  access("super"),
  brandHandler.updateBrand
);
// get list brand
router.get("/", brandHandler.getAllBrand);
// get detail brand with varians
router.get("/detail/:id", brandHandler.detailBrand);
// get brand detail without varians for edit brand
router.get("/edit/:id", brandHandler.getBrand);
// delete brand
router.delete(
  "/delete",
  verifyLogin,
  access("super"),
  brandHandler.deleteBrand
);

module.exports = router;
