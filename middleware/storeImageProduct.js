const multer = require("multer");
const path = require("path");
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
  limits: { fileSize: 3000000 },
  fileFilter(req, file, cb) {
    // upload only png and jpg
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return cb(new Error("Please upload an image"));
    }
    cb(null, true);
  },
});

module.exports = { upload };
