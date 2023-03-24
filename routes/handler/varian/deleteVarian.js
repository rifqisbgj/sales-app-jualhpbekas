const { Varian } = require("../../../models");
const logger = require("../../../helper/logger");

module.exports = async (req, res) => {
  // set meta data log
  const childLogger = logger.child({ user: `${req.user.data.email}` });
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
    // add error log varian
    childLogger.error(
      `Gagal menghapus varian ${varian.namavarian}, terdapat produk pada varian`,
      {
        method: req.method,
        url: req.originalUrl,
      }
    );
    return res.status(409).json([
      {
        status: "error",
        message: "Terdapat produk pada varian",
      },
    ]);
  }
  const tempVarian = varian.namavarian;
  // hapus varian dengan fungsi destroy()
  await varian.destroy();
  // add log delete varian berhasil
  childLogger.warn(`Berhasil menghapus varian ${tempVarian}`, {
    method: req.method,
    url: req.originalUrl,
  });
  return res.json({ status: "success", message: "Data berhasil dihapus" });
};
