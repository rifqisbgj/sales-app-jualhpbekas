const { Customer } = require("../../../models");
const validateUUID = require("../../../helper/validateUUID");
const Validator = require("fastest-validator");
const v = new Validator({
  messages: {
    string: "Silahkan cek kembali bidang {field} ",
    stringEmpty: "{field} tidak boleh kosong",
    required: "{field} tidak boleh kosong",
  },
});
module.exports = async (req, res) => {
  // validasi UUID berdasarkan params id
  if (!validateUUID(req.params.id))
    return res
      .status(400)
      .json([{ status: "error", message: "Invalid customer identity" }]);

  //   check customer exist or no
  const isCus = await Customer.findByPk(req.params.id);

  //   if cus not found
  if (!isCus) {
    return res
      .status(404)
      .json([{ status: "error", message: "Customer not found" }]);
  }

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
    nama: req.body.nama,
    notelp: req.body.notelp,
  };

  //   update to db
  await isCus.update(data);
  //   res after success create customer
  return res.json({ status: "success", data: isCus });
};
