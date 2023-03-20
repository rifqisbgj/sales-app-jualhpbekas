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
  console.log(req.body);
  const schema = {
    namavarian: "string|empty:false",
  };

  // validasi inputan dengan schema pengecekan
  const validate = v.validate(req.body, schema);

  // jika terdapat error pada validasi
  if (validate.length) {
    return res.status(400).json({
      status: "error",
      message: validate,
    });
  }

  // ambil data dari inputan (req.body) dan disimpan pada kolom namavarian dan id_merk
  const data = {
    namavarian: req.body.namavarian,
    id_merk: req.body.idMerek,
  };

  // Check varian exist
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
    return res.status(409).json([
      {
        status: "error",
        message: "Varian sudah tersedia",
      },
    ]);
  }

  const varian = await Varian.create(data);
  return res.json({
    status: "success",
    data: varian,
  });
};
