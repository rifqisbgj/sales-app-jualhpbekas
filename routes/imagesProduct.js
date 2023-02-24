const express = require("express");
const router = express.Router();
const path = require("path");
const imgProductHandler = require("./handler/product-images");

const multer = require("multer");
const storage = multer.diskStorage({
  // image storage
  destination: "./public/product-image/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    // set filename
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});
// initialitation storage multer
const upload = multer({ storage });

// Store new image product
router.post(
  "/store",
  // middleware for get maximum five image product
  upload.array("product-image", 5),
  imgProductHandler.createProductImage
);

module.exports = router;
