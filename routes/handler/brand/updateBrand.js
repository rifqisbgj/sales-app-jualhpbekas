const { Merek, sequelize } = require("../../../models");
const Validator = require("fastest-validator");
// Custom error messages for validation
const v = new Validator({
  messages: {
    string: "Silahkan cek kembali bidang {field} ",
    stringEmpty: "Nama merk tidak boleh kosong",
  },
});

module.exports = async (req, res) => {
  // namamerek tidak boleh kosong
  const schema = {
    namamerek: "string|empty:false",
  };

  // ambil params id
  const id = req.params.id;
  // ambil merek berdasarkan Pk
  const merek = await Merek.findByPk(id);

  // jika merek tidak tersedia
  if (!merek) {
    return res
      .status(404)
      .json({ status: "error", message: "Data tidak ditemukan" });
  }

  // validasi inputan dengan schema pengecekan
  const validate = v.validate(req.body, schema);

  // jika terdapat error pada validasi
  if (validate.length) {
    return res.status(400).json({
      status: "error",
      message: validate,
    });
  }

  // Cek, apakah nama merek yang diinputkan sudah ada sebelumnya atau belum
  // sequelize.fn untuk merubah value dari kolom yang ada di db
  const isMerekExist = await Merek.findOne({
    where: {
      namamerek: sequelize.where(
        sequelize.fn("lower", sequelize.col("namamerek")),
        req.body.namamerek.toLowerCase()
      ),
    },
  });

  // jika merek sudah tersedia, maka kembalikan error status 409
  if (isMerekExist) {
    return res.status(409).json({
      status: "error",
      message: "Merek sudah tersedia",
    });
  }
  // ubah nama merek
  const dataUpdate = await merek.update({
    namamerek: req.body.namamerek,
  });
  // res ketika berhasil update
  return res.json({
    status: "success",
    data: dataUpdate,
  });
};
