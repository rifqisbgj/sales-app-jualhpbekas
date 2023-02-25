const { GambarProduk, Produk } = require("../../../models");
const Validator = require("fastest-validator");
// Custom error messages for validation
const v = new Validator({
  messages: {
    string: "Silahkan cek kembali bidang {field} ",
    stringEmpty: "Nama varian tidak boleh kosong",
    // error handling uuid type
    uuid: "Kesalahan format pada '{field}'",
    // error handling uuidVersion validation
    uuidVersion: "Kesalahan versi UUID",
    required: "{field} tidak boleh kosong",
  },
});

module.exports = async (req, res) => {
  const schema = {
    idProduk: "uuid|version:1",
  };
  const validate = v.validate(req.body, schema);
  //   check product valid
  const isProduk = await Produk.findByPk(req.body.idProduk);
  //   if product doesn't valid
  if (!isProduk) {
    return res
      .status(404)
      .send({ status: "error", message: "produk tidak ditemukan" });
  }
  //   if no one file or have validation error
  if (!req.files || validate.length) {
    return res
      .status(400)
      .json({ status: "error", message: "input not valid" });
  }
  //   store data input
  let dataImage = [];
  //   store to db
  req.files.forEach(async (image) => {
    await GambarProduk.create({
      image: image.filename,
      id_produk: req.body.idProduk,
    });
  });
  //   data for response success
  req.files.forEach((data) => {
    dataImage.push({ image: data.filename, id_produk: req.body.idProduk });
  });
  return res.json({ status: "success", data: dataImage });
};
