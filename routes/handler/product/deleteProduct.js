const { Produk, GambarProduk } = require("../../../models");
const deleteFile = require("../../../helper/deleteFile");
const fs = require("fs");
const logger = require("../../../helper/logger");

module.exports = async (req, res) => {
  const childLogger = logger.child({ user: `${req.user.data.email}` });
  // ambil data produk, gambar produk, dan hasil QC berdasarkan slug produk
  const product = await Produk.findByPk(req.body.id, {
    include: ["gambarProduk", "qcProduct"],
  });
  // res jika produk tidak tersedia
  if (!product) {
    return res
      .status(404)
      .json({ status: "error", message: "product not found" });
  }
  // jika produk memiliki hasil QC maka tampilkan error conflict
  if (product.qcProduct) {
    await product.update({ active: false });
    childLogger.warn(
      `Produk dengan kode: ${product.kodeproduk} berhasil dinon-aktifkan`,
      {
        method: req.method,
        url: req.originalUrl,
      }
    );
    return res.json({
      status: "success",
      message: "Product deactivated",
    });
  }
  // jika produk memiliki gambar produk
  if (product.gambarProduk.length) {
    product.gambarProduk.forEach((img) => {
      // cek ketersediaan file foto produk
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
  childLogger.info(
    `Produk dengan kode: ${product.kodeproduk} berhasil dihapus`,
    {
      method: req.method,
      url: req.originalUrl,
    }
  );
  return res.json({ status: "success", message: "Product deleted" });
};
