const { Merek } = require("../../../models");
const Validator = require("fastest-validator");
// Custom error messages for validation number & required
const v = new Validator({
  messages: {
    number: "Kesalahan format pada '{field}'",
    required: "'{field}' kosong dan harus diisi",
  },
});

module.exports = async (req, res) => {
  // idMerek harus bertipe number
  const schema = {
    idMerek: "number",
  };

  // memvalidasi body denganschema yang telah diberikan
  const validate = v.validate(req.body, schema);

  // jika terdapat error pada validasi
  if (validate.length) {
    return res.status(400).json({ status: "error", message: validate });
  }

  // mengecek ketersediaan data pada Merek beserta varian di dalammnya berdasarkan idMerek
  const merek = await Merek.findByPk(req.body.idMerek, {
    include: ["varians"],
  });

  // jika merek tidak tersedia
  if (!merek) {
    return res.status(404).json({
      status: "error",
      message: "Data tidak ditemukan",
    });
  }

  // jika merek memiliki varian
  if (merek.varians.length) {
    return res.status(409).json({
      status: "error",
      message: "Terdapat varian pada merek tersebut",
    });
  }
  // hapus merek dengan fungsi destroy()
  await merek.destroy();
  return res.json({ status: "success", message: "Data berhasil dihapus" });
};
