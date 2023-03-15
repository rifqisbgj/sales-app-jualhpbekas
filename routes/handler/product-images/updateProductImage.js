const { GambarProduk } = require("../../../models");
const fs = require("fs");
const deleteFile = require("../../../helper/deleteFile");

module.exports = async (req, res) => {
  const imgprdk = await GambarProduk.findByPk(req.body.idImgProduct);

  // check image product exist
  if (!imgprdk) {
    // delete image when image product doesn't exist
    deleteFile(`./public/product-image/${req.file.filename}`);
    return res
      .status(404)
      .json([{ status: "error", message: "product image not found" }]);
  }

  if (!req.file)
    return res
      .status(400)
      .json([{ status: "error", message: "image file can't blank" }]);

  //   check file exist
  if (fs.existsSync(`./public/product-image/${imgprdk.image}`)) {
    // delete image file
    deleteFile(`./public/product-image/${imgprdk.image}`);
  }

  //   update from db
  await imgprdk.update({ image: req.file.filename });
  return res.json({
    status: "success",
    message: "product image success updated",
  });
};
