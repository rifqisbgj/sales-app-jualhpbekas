const express = require("express");
const router = express.Router();
const brandHandler = require("./handler/brand");

// Store new brand
router.post("/store", brandHandler.createBrand);
// update a brand
router.put("/update/:id", brandHandler.updateBrand);
// get list brand
router.get("/", brandHandler.getAllBrand);
// get detail brand with varians
router.get("/detail-varians/:id", brandHandler.detailBrand);
// get brand detail without varians
router.get("/detail/:id", brandHandler.getBrand);
// delete brand
router.delete("/delete", brandHandler.deleteBrand);

module.exports = router;
