const { Produk, GambarProduk, Varian, HasilQC } = require("../../../models");

module.exports = async (req, res) => {
  // find by slug
  const produk = await Produk.findOne({
    where: { slug: req.params.slug },
    attributes: { exclude: ["updatedAt"] },
    include: [
      { model: GambarProduk, as: "gambarProduk", attributes: ["image", "id"] },
      {
        model: Varian,
        as: "varianProduk",
        attributes: ["namavarian", "id_merk"],
      },
      {
        model: HasilQC,
        as: "qcProduct",
        attributes: { exclude: ["id_produk", "id_adminqc", "updatedAt"] },
      },
    ],
  });

  // product doesn't exist
  if (!produk) {
    return res
      .status(404)
      .json({ status: "error", message: "produk tidak ditemukan" });
  }

  return res.json({ status: "success", data: produk });
};
