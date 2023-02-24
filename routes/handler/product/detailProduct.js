const { Produk, GambarProduk } = require("../../../models");

module.exports = async (req, res) => {
  // find by slug
  const produk = await Produk.findOne({
    where: { slug: req.params.slug },
    include: { model: GambarProduk, as: "gambarProduk", attributes: ["image"] },
  });

  // product doesn't exist
  if (!produk) {
    return res
      .status(404)
      .json({ status: "error", message: "produk tidak ditemukan" });
  }

  return res.json({ status: "success", data: produk });
};
