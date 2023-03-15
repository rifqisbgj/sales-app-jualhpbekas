const { Produk, Varian } = require("../../../models");
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
  console.log(req.body);
  const schema = {
    imei: "string|numeric:true|length:15",
    harga: "string|optional|min:0",
    deskripsi: "string|optional",
    ram: "string|numeric:true|empty:false",
    storage: "string|numeric:true|empty:false",
    warna: "string|empty:false",
    varian: "string|empty:false",
    // enum fastest validator tidak memiliki shorthand format
    status: { type: "enum", values: ["BQC", "PQC", "SQC", "SJ", "D"] },
  };

  // Check produk exist
  const produk = await Produk.findOne({
    where: { slug: req.params.slug },
  });

  // produk doesn't exist
  if (!produk) {
    return res
      .status(404)
      .json([{ status: "error", message: "Data produk tidak tersedia" }]);
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

  // check imei exist
  const isImeiExist = await Produk.findOne({
    where: { imei: req.body.imei },
  });

  // jika imei produk sudah tersedia, maka kembalikan error status 409
  if (isImeiExist && req.body.imei !== produk.imei) {
    return res.status(409).json([
      {
        status: "error",
        message: "imei sudah tersedia",
      },
    ]);
  }

  // check varian valid
  const isVarianValid = await Varian.findByPk(req.body.varian);

  if (!isVarianValid) {
    return res
      .status(404)
      .json([{ status: "error", message: "varian tidak ditemukan" }]);
  }

  // ambil data dari inputan dan disimpan pada kolom table Produk
  const data = {
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
    harga: req.body.harga,
    id_varian: req.body.varian,
    ram: req.body.ram,
    deskripsi: req.body.deskripsi,
    storage: req.body.storage,
    statusproduk: req.body.status,
    warna: req.body.warna,
  };
  // update produk
  await produk.update(data);
  // res if success
  return res.json({
    status: "success",
    data: produk,
  });
};
