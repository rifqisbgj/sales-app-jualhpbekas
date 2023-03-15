const { Produk, Varian } = require("../../../models");
const { v1: uuidv1 } = require("uuid");
const slug = require("slug");
const Validator = require("fastest-validator");
const uniqueCode = require("../../../helper/uniqueCode");
const generateRandomString = require("../../../helper/randomString");
// Custom error messages for validation
const v = new Validator({
  messages: {
    string: "Silahkan cek kembali bidang {field} ",
    stringEmpty: "{field} tidak boleh kosong",
    number: "Kesalahan format pada '{field}'",
    required: "{field} tidak boleh kosong",
    stringNumeric: "{field} harus berupa angka",
    stringLength: "{field} harus berisi 15 digit",
  },
});

module.exports = async (req, res) => {
  // schema validasi
  const schema = {
    imei: "string|numeric:true|length:15",
    harga: "string|optional|min:0",
    deskripsi: "string|optional",
    ram: "string|numeric:true|empty:false",
    storage: "string|numeric:true|empty:false",
    warna: "string|empty:false",
    varian: "string|empty:false",
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

  // Check product imei exist
  const isImeiExist = await Produk.findOne({
    where: { imei: req.body.imei },
  });

  // jika imei produk sudah tersedia, maka kembalikan error status 409
  if (isImeiExist) {
    return res.status(409).json([
      {
        status: "error",
        message: "imei sudah tersedia",
      },
    ]);
  }

  // check varian valid
  const isVarianValid = await Varian.findByPk(req.body.varian);

  // jika varian tidak valid
  if (!isVarianValid) {
    return res
      .status(404)
      .json([{ status: "error", message: "varian tidak ditemukan" }]);
  }

  // ambil data dari inputan dan disimpan pada kolom table Produk
  const data = {
    // generate uuid v1
    id: uuidv1(),
    imei: req.body.imei,
    // generate product code
    kodeproduk: "PRD - " + uniqueCode(),
    slug: slug(
      isVarianValid.namavarian +
        " " +
        req.body.warna +
        " " +
        req.body.storage +
        " " +
        generateRandomString(10)
    ),
    harga: parseInt(req.body.harga),
    id_varian: parseInt(req.body.varian),
    ram: parseInt(req.body.ram),
    deskripsi: req.body.deskripsi,
    storage: parseInt(req.body.storage),
    warna: req.body.warna,
  };
  // tambah data produk
  const produk = await Produk.create(data);
  return res.json({
    status: "success",
    data: produk,
  });
};
