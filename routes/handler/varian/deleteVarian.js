const { Varian } = require("../../../models");
module.exports = async (req, res) => {
  // mengecek ketersediaan data pada Varian beserta produk di dalammnya berdasarkan idVarian
  const varian = await Varian.findByPk(req.body.idVarian, {
    include: ["produk"],
  });

  // jika varian tidak tersedia
  if (!varian) {
    return res.status(404).json([
      {
        status: "error",
        message: "Data tidak ditemukan",
      },
    ]);
  }

  // jika varian memiliki produk
  if (varian.produk.length) {
    return res.status(409).json([
      {
        status: "error",
        message: "Terdapat produk pada varian",
      },
    ]);
  }
  // hapus varian dengan fungsi destroy()
  await varian.destroy();
  return res.json({ status: "success", message: "Data berhasil dihapus" });
};
