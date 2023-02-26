const { GambarProduk } = require("../../../models");
const fs = require("fs");

module.exports = async (req, res) => {
  const imgprdk = await GambarProduk.findByPk(req.body.idImgProduct);

  if (!req.file)
    return res
      .status(400)
      .json({ status: "error", message: "image file can't blank" });

  //   check file exist
  if (fs.existsSync(`./public/product-image/${imgprdk.image}`)) {
    // delete image
    fs.unlink(`./public/product-image/${imgprdk.image}`, (err) => {
      if (err) {
        throw err;
      }
    });
  }

  //   update from db
  await imgprdk.update({ image: req.file.filename });
  return res.json({
    status: "success",
    message: "product image success updated",
  });
};
