const express = require("express");
const router = express.Router();
const productHandler = require("./handler/product");

const verifyLogin = require("../middleware/verifyUser");
const access = require("../middleware/permission");

// Store new product
router.post(
  "/store",
  verifyLogin,
  access("super", "adminSale", "adminQC"),
  productHandler.createProduct
);
// update a product
router.put(
  "/update/:slug",
  verifyLogin,
  access("super", "adminSale"),
  productHandler.updateProduct
);
// get list product
router.get("/", productHandler.getAllProduct);
// get detail product
router.get("/detail/:slug", productHandler.detailProduct);
// delete product
router.delete(
  "/delete",
  verifyLogin,
  access("super", "adminSale"),
  productHandler.deleteProduct
);

module.exports = router;
