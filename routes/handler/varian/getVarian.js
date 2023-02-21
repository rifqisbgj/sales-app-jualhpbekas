const { Varian } = require("../../../models");

module.exports = async (req, res) => {
  // check varian exist
  const varian = await Varian.findByPk(req.params.id, {
    attributes: ["namavarian", "id_merk"],
  });

  if (!varian) {
    return res
      .status(404)
      .json({ status: "error", message: "Varian tidak ditemukan" });
  }

  return res.json({
    status: `success get varian ${varian.namavarian}`,
    data: varian,
  });
};
