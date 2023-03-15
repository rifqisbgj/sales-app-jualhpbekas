const express = require("express");
const router = express.Router();
const imgProductHandler = require("./handler/product-images");
const { upload } = require("../middleware/storeImageProduct");

const verifyLogin = require("../middleware/verifyUser");
const access = require("../middleware/permission");

// Store new image product
router.post(
  "/store",
  verifyLogin,
  access("super", "adminSale"),
  // middleware for upload max five image product
  upload.array("productImage", 5),
  imgProductHandler.createProductImage,
  (error, req, res, next) => {
    // send error image input
    console.log(error.message);
    return res.status(400).send([{ message: error.message }]);
  }
);

// Update image product
router.put(
  "/update",
  verifyLogin,
  access("super", "adminSale"),
  // middleware for upload single image product
  upload.single("productImage"),
  imgProductHandler.updateImage,
  (error, req, res, next) => {
    // send error image input
    return res.status(400).send([{ message: error.message }]);
  }
);

// delete an image
router.delete(
  "/delete",
  verifyLogin,
  access("super", "adminSale"),
  imgProductHandler.deleteImage
);

module.exports = router;
