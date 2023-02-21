const { Varian, sequelize } = require("../../../models");
const Validator = require("fastest-validator");
// Custom error messages for validation
const v = new Validator({
  messages: {
    string: "Silahkan cek kembali bidang {field} ",
    stringEmpty: "Nama varian tidak boleh kosong",
    number: "Kesalahan format pada '{field}'",
    required: "{field} tidak boleh kosong",
  },
});

module.exports = async (req, res) => {
  const schema = {
    namavarian: "string|empty:false",
    idMerek: "number",
  };
  const id = req.params.id;
  //   get data with Varian id
  const varian = await Varian.findByPk(id);

  //   varian doesn't exist
  if (!varian) {
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

  // Cek nama varian sudah tersedia/belum
  // sequelize.fn untuk merubah value dari kolom yang ada di db
  const isVarianExist = await Varian.findOne({
    where: {
      cekNamaVarian: sequelize.where(
        sequelize.fn("lower", sequelize.col("namavarian")),
        req.body.namavarian.toLowerCase()
      ),
    },
  });

  // jika varian sudah tersedia, maka kembalikan error status 409
  if (isVarianExist) {
    return res.status(409).json({
      status: "error",
      message: "Varian sudah tersedia",
    });
  }

  const dataUpdate = await varian.update({
    namavarian: req.body.namavarian,
    id_merk: req.body.idMerek,
  });

  return res.json({
    status: "success",
    data: dataUpdate,
  });
};
