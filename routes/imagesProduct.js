const express = require("express");
const router = express.Router();
const imgProductHandler = require("./handler/product-images");
const { upload } = require("../middleware/storeImageProduct");

// Store new image product
router.post(
  "/store",
  // middleware for upload max five image product
  upload.array("product-image", 5),
  imgProductHandler.createProductImage,
  (error, req, res, next) => {
    // send error image input
    return res.status(400).send({ error: error.message });
  }
);

module.exports = router;
