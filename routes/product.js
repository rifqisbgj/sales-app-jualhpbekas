const express = require("express");
const router = express.Router();
const productHandler = require("./handler/product");

// Store new product
router.post("/store", productHandler.createProduct);
// update a product
router.put("/update/:slug", productHandler.updateProduct);
// get list product
router.get("/", productHandler.getAllProduct);
// get detail product
router.get("/detail/:slug", productHandler.detailProduct);
// delete product
// router.delete("/delete", productHandler.deleteProduct);

module.exports = router;
