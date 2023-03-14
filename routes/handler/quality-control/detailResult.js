const { HasilQC, Produk, Users } = require("../../../models");
const validateUUID = require("../../../helper/validateUUID");

module.exports = async (req, res) => {
  // validasi UUID berdasarkan params id
  if (!validateUUID(req.params.id))
    return res
      .status(400)
      .json({ status: "error", message: "Invalid quality control identity" });

  // menampilkan detail hasil qc dengan nilai imei, kodeproduk, ram, storage, warna dan nama adminQC
  const qc = await HasilQC.findByPk(req.params.id, {
    attributes: { exclude: ["updatedAt"] },
    include: [
      {
        model: Produk,
        as: "produkQC",
        attributes: ["imei", "kodeproduk", "ram", "storage", "warna"],
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
