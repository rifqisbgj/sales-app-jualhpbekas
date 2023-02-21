const { Varian } = require("../../../models");
const Validator = require("fastest-validator");
// Custom error messages for validation number & required
const v = new Validator({
  messages: {
    number: "Kesalahan format pada '{field}'",
    required: "'{field}' kosong dan harus diisi",
  },
});

module.exports = async (req, res) => {
  // idVarian harus bertipe number
  const schema = {
    idVarian: "number",
  };

  // memvalidasi body dengan schema yang telah diberikan
  const validate = v.validate(req.body, schema);

  // jika terdapat error pada validasi
  if (validate.length) {
    return res.status(400).json({ status: "error", message: validate });
  }

  // mengecek ketersediaan data pada Varian beserta produk di dalammnya berdasarkan idVarian
  const varian = await Varian.findByPk(req.body.idVarian, {
    include: ["produk"],
  });

  // jika varian tidak tersedia
  if (!varian) {
    return res.status(404).json({
      status: "error",
      message: "Data tidak ditemukan",
    });
  }

  // jika varian memiliki produk
  if (varian.produk.length) {
    return res.status(409).json({
      status: "error",
      message: "Terdapat produk pada varian",
    });
  }
  // hapus varian dengan fungsi destroy()
  await varian.destroy();
  return res.json({ status: "success", message: "Data berhasil dihapus" });
};
