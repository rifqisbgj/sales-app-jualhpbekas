const { Transaksi, Produk } = require("../../../models");
const { v1: uuidv1 } = require("uuid");
const Validator = require("fastest-validator");
const uniqueCode = require("../../../helper/uniqueCode");
const v = new Validator({
  messages: {
    // error handling uuid type
    uuid: "Kesalahan format pada '{field}'",
    // error handling uuidVersion validation
    uuidVersion: "Kesalahan versi UUID",
    required: "{field} tidak boleh kosong",
    array: "{field} kurang tepat",
    arrayEmpty: "{field} tidak boleh kosong",
  },
});
module.exports = async (req, res) => {
  console.log(req.body);
  const schema = {
    idCustomer: "uuid|version:1",
    detail: "array|empty:false",
  };

  // console.log(req.body.detail);

  // validasi inputan dengan schema pengecekan
  const validate = v.validate(req.body, schema);

  // jika terdapat error pada validasi
  if (validate.length) {
    return res.status(400).json({
      status: "error",
      message: validate,
    });
  }

  // set terjual
  req.body.detail.forEach(async (trx) => {
    const produk = await Produk.findByPk(trx.id);
    produk.update({ statusproduk: "T" });
  });

  // generate invoice
  const d = new Date();
  const invoice = `${d.getFullYear()}${d.getDate()}${d.getHours()}${d.getMilliseconds()}${uniqueCode()}`;
  // store customer input
  const data = {
    id: uuidv1(),
    id_customer: req.body.idCustomer,
    detail: req.body.detail,
    kode_invoice: invoice,
    id_admin: req.user.data.id,
    total: req.body.total,
  };
  console.log(data);

  //   store to db
  const transaksi = await Transaksi.create(data);
  //   res after success create transaksi
  return res.json({ status: "success", data: transaksi });
};
