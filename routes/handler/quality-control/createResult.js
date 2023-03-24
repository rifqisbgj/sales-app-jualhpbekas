const { HasilQC, Produk, Users } = require("../../../models");
const { v1: uuidv1 } = require("uuid");
const uniqueCode = require("../../../helper/uniqueCode");
const Validator = require("fastest-validator");
const logger = require("../../../helper/logger");
// Custom error messages for validation
const v = new Validator({
  messages: {
    // error handling uuid type
    uuid: "Kesalahan format pada '{field}'",
    // error handling uuidVersion validation
    uuidVersion: "Kesalahan versi UUID",
    boolean: "Format input {field} tidak tepat",
    required: "{field} tidak boleh kosong",
  },
});

module.exports = async (req, res) => {
  // set meta data log
  const childLogger = logger.child({ user: `${req.user.data.email}` });
  const schema = {
    layar: "boolean",
    batre: "boolean",
    sinyal: "boolean",
    id_produk: "uuid|version:1",
    id_adminqc: "uuid|version:1",
  };

  // validasi inputan dengan schema pengecekan
  const validate = v.validate(req.body, schema);

  //   jika terjadi error validasi
  if (validate.length) {
    // add error log qc result
    childLogger.error(`Gagal menambahkan hasil QC, format input salah`, {
      method: req.method,
      url: req.originalUrl,
    });
    return res.status(400).json({ status: "error", message: validate });
  }

  // check product exist
  const isProduct = await Produk.findByPk(req.body.id_produk);
  if (!isProduct)
    return res
      .status(404)
      .json([{ status: "error", message: "produk tidak tersedia" }]);

  // check user exist
  const isUser = await Users.findByPk(req.body.id_adminqc);
  if (!isUser)
    return res
      .status(404)
      .json([{ status: "error", message: "admin QC tidak tersedia" }]);

  // store data qc result
  const data = {
    id: uuidv1(),
    kodeQC: "QCR - " + uniqueCode(),
    layar: req.body.layar,
    batre: req.body.batre,
    sinyal: req.body.sinyal,
    catatan: req.body.catatan,
    id_produk: req.body.id_produk,
    id_adminqc: req.body.id_adminqc,
  };

  const hasilqc = await HasilQC.create(data);
  // add info log success create QC
  childLogger.info(
    `Berhasil menambahkan hasil QC dengan kode: ${hasilqc.kodeQC}`,
    {
      method: req.method,
      url: req.originalUrl,
    }
  );
  // update status produk ke selesai qc
  await isProduct.update({ statusproduk: "SQC" });
  // add info log update statusproduk -> SQC
  childLogger.info(
    `Berhasil melakukan QC produk dengan kode: ${isProduct.kodeproduk}`,
    {
      method: req.method,
      url: req.originalUrl,
    }
  );
  return res.json({ status: "success", data: hasilqc });
};
