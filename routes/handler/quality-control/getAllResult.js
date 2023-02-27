const { HasilQC, Produk, Users } = require("../../../models");

module.exports = async (req, res) => {
  // menampilkan seluruh data hasil qc dengan kolom imei produk, kode QC,idQC dan nama admin
  const qc = await HasilQC.findAll({
    attributes: ["kodeQC", "id"],
    include: [
      { model: Produk, as: "produkQC", attributes: ["imei"] },
      { model: Users, as: "qcBy", attributes: ["nama"] },
    ],
  });

  return res.json({ status: "success", data: qc });
};
