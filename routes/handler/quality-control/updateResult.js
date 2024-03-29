const { HasilQC, Produk, Users } = require("../../../models");
const Validator = require("fastest-validator");
const validateUUID = require("../../../helper/validateUUID");
const logger = require("../../../helper/logger");

// Custom error messages for validation
const v = new Validator({
  messages: {
    boolean: "Format input {field} tidak tepat",
    required: "{field} tidak boleh kosong",
    // error handling uuid type
    uuid: "Kesalahan format pada '{field}'",
    // error handling uuidVersion validation
    uuidVersion: "Kesalahan versi UUID",
  },
});

module.exports = async (req, res) => {
  // set meta data log
  const childLogger = logger.child({ user: `${req.user.data.email}` });
  // validasi UUID berdasarkan params id
  if (!validateUUID(req.params.id))
    return res
      .status(400)
      .json({ status: "error", message: "Invalid quality control identity" });

  const schema = {
    layar: "boolean",
    batre: "boolean",
    sinyal: "boolean",
    id_produk: "uuid|version:1",
    id_adminqc: "uuid|version:1",
  };

  const qc = await HasilQC.findByPk(req.params.id);

  if (!qc) {
    return res
      .status(404)
      .json({ status: "error", message: "Quality control result not found" });
  }

  // validasi inputan dengan schema pengecekan
  const validate = v.validate(req.body, schema);

  //   jika terjadi error validasi
  if (validate.length) {
    // add error log update QC
    childLogger.error(
      `Gagal memperbarui QC dengan kode: ${qc.kodeQC}, format input salah`,
      {
        method: req.method,
        url: req.originalUrl,
      }
    );
    return res.status(400).json({ status: "error", message: validate });
  }

  // check product exist
  const isProduct = await Produk.findByPk(req.body.id_produk);
  if (!isProduct)
    return res
      .status(404)
      .json({ status: "error", message: "produk tidak tersedia" });

  // check user exist
  const isUser = await Users.findByPk(req.body.id_adminqc);
  if (!isUser)
    return res
      .status(404)
      .json({ status: "error", message: "admin QC tidak tersedia" });

  // update data qc result
  const dataQc = await qc.update({
    layar: req.body.layar,
    batre: req.body.batre,
    sinyal: req.body.sinyal,
    catatan: req.body.catatan,
  });
  // add info log success update QC
  childLogger.info(`Berhasil memperbarui QC dengan kode: ${qc.kodeQC}`, {
    method: req.method,
    url: req.originalUrl,
  });

  return res.json({ status: "success", data: dataQc });
};
