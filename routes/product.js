const express = require("express");
const router = express.Router();
const productHandler = require("./handler/product");

// Store new product
router.post("/store", productHandler.createProduct);
// update a product
router.put("/update/:id", productHandler.updateProduct);
// get list brand
// router.get("/", brandHandler.getAllBrand);
// get detail brand with varians
// router.get("/detail/:id", brandHandler.detailBrand);
// get brand detail without varians for edit brand
// router.get("/edit/:id", brandHandler.getBrand);
// delete brand
// router.delete("/delete", brandHandler.deleteBrand);

module.exports = router;
