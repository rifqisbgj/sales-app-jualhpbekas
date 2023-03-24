const { HasilQC } = require("../../../models");
const Validator = require("fastest-validator");
const logger = require("../../../helper/logger");
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
  const schema = {
    id_qc: "uuid|version:1",
  };

  const qc = await HasilQC.findByPk(req.body.id_qc);
  const kodeQC = qc.kodeQC;

  if (!qc) {
    return res
      .status(404)
      .json([{ status: "error", message: "Quality control result not found" }]);
  }

  // validasi inputan dengan schema pengecekan
  const validate = v.validate(req.body, schema);

  //   jika terjadi error validasi
  if (validate.length) {
    return res.status(400).json({ status: "error", message: validate });
  }

  await qc.destroy();
  // add info log success update QC
  childLogger.warn(`Berhasil menghapus QC dengan kode: ${kodeQC}`, {
    method: req.method,
    url: req.originalUrl,
  });
  return res.json({ status: "success", message: `${kodeQC} success deleted` });
};
