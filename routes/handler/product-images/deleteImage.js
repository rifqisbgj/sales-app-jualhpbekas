const { GambarProduk } = require("../../../models");
const deleteFile = require("../../../helper/deleteFile");
const fs = require("fs");

module.exports = async (req, res) => {
  const imgprdk = await GambarProduk.findByPk(req.body.idImgProduct);

  // check image product exist
  if (!imgprdk) {
    return res
      .status(404)
      .json({ status: "error", message: "product image not found" });
  }

  //   check file exist
  if (fs.existsSync(`./public/product-image/${imgprdk.image}`)) {
    // delete image file
    deleteFile(`./public/product-image/${imgprdk.image}`);
  }

  //   delete from db
  await imgprdk.destroy();
  return res.json({
    status: "success",
    message: "product image success deleted",
  });
};
