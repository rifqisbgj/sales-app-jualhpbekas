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
const upload = multer({
  storage,
  limits: { fileSize: 1000000 },
  fileFilter(req, file, cb) {
    // upload only png and jpg
    if (!file.originalname.match(/\.(png|jpg)$/)) {
      return cb(new Error("Please upload a Image"));
    }
    cb(null, true);
  },
});

// Store new image product
router.post(
  "/store",
  // middleware for get maximum five image product
  upload.array("product-image", 1),
  imgProductHandler.createProductImage,
  (error, req, res, next) => {
    // send error image input
    return res.status(400).send({ error: error.message });
  }
);

module.exports = router;
