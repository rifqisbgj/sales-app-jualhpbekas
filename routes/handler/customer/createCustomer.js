const { Customer } = require("../../../models");
const { v1: uuidv1 } = require("uuid");
const Validator = require("fastest-validator");
const v = new Validator({
  messages: {
    string: "Silahkan cek kembali bidang {field} ",
    stringEmpty: "{field} tidak boleh kosong",
    required: "{field} tidak boleh kosong",
  },
});
module.exports = async (req, res) => {
  const schema = {
    nama: "string|empty:false",
    notelp: "string|empty:false",
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
  // store customer input
  const data = {
    id: uuidv1(),
    nama: req.body.nama,
    notelp: req.body.notelp,
  };

  console.log(data);

  //   store to db
  const cus = await Customer.create(data);
  //   res after success create customer
  return res.json({ status: "success", data: cus });
};
