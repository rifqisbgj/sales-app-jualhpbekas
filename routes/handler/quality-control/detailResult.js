const { HasilQC, Produk, Users } = require("../../../models");

module.exports = async (req, res) => {
  // menampilkan detail hasil qc dengan nilai imei, namaproduk, ram, storage, warna dan nama adminQC
  const qc = await HasilQC.findByPk(req.params.id, {
    attributes: { exclude: ["updatedAt"] },
    include: [
      {
        model: Produk,
        as: "produkQC",
        attributes: ["imei", "namaproduk", "ram", "storage", "warna"],
      },
      { model: Users, as: "qcBy", attributes: ["nama"] },
    ],
  });

  if (!qc) {
    return res
      .status(404)
      .json({ status: "error", message: "Quality control result not found" });
  }

  return res.json({ status: "success", data: qc });
};
