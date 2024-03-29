const { Varian, Produk, Merek } = require("../../../models");

module.exports = async (req, res) => {
  // check varian exist
  const varian = await Varian.findByPk(req.params.id, {
    // associate Varian with Produk as produk and get specific attributes
    include: [
      {
        model: Produk,
        as: "produk",
        attributes: [
          "imei",
          "kodeproduk",
          "harga",
          "statusproduk",
          "ram",
          "storage",
          "warna",
          "slug",
        ],
      },
      { model: Merek, as: "merk", attributes: ["namamerek"] },
    ],
    attributes: ["namavarian"],
  });

  //   res if varian not found
  if (!varian) {
    return res
      .status(404)
      .json({ status: "error", message: "Varian tidak ditemukan" });
  }
  // res data success
  return res.json({ status: "success get detail varian", data: varian });
};
