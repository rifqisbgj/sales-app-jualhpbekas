const { Produk, GambarProduk } = require("../../../models");
const deleteFile = require("../../../helper/deleteFile");
const fs = require("fs");

module.exports = async (req, res) => {
  const product = await Produk.findOne({
    where: { slug: req.body.slug },
    include: ["gambarProduk", "qcProduct"],
  });

  if (!product) {
    return res
      .status(404)
      .json({ status: "error", message: "product not found" });
  }

  if (product.produkQC) {
    return res.status(409).json({
      status: "error",
      message: "Product have quality control result",
    });
  }

  if (product.gambarProduk.length) {
    product.gambarProduk.forEach((img) => {
      if (fs.existsSync(`./public/product-image/${img.image}`)) {
        // delete image file
        deleteFile(`./public/product-image/${img.image}`);
      }
    });
    // delete all product image by id_produk
    await GambarProduk.destroy({
      where: {
        id_produk: product.id,
      },
    });
  }

  // delete product
  await product.destroy();

  return res.json({ status: "success", message: "Product deleted" });
};
