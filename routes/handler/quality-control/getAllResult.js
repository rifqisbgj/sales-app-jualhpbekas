const { HasilQC, Produk, Users } = require("../../../models");

module.exports = async (req, res) => {
  const getQCByAdmin = {};
  if (req.user.data.role !== "super") {
    getQCByAdmin.where = {
      id_adminqc: req.user.data.id,
    };
  }
  // menampilkan seluruh data hasil qc dengan kolom imei produk, kode QC,idQC dan nama admin
  const qc = await HasilQC.findAll({
    attributes: ["kodeQC", "id"],
    include: [
      {
        model: Produk,
        as: "produkQC",
        attributes: ["id", "imei", "kodeproduk", "slug"],
        include: ["varianProduk"],
      },
      { model: Users, as: "qcBy", attributes: ["nama"] },
    ],
    where: getQCByAdmin.where,
    order: [["createdAt", "DESC"]],
  });

  return res.json({ status: "success", data: qc });
};
