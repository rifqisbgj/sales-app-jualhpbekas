const { Varian } = require("../../../models");

module.exports = async (req, res) => {
  // get varian by id brand
  const varian = await Varian.findAll({
    where: {
      id_merk: req.params.id,
    },
  });

  // if varian doesn't exist
  if (!varian) {
    return res
      .status(404)
      .json({ status: "error", message: "Varian tidak ditemukan" });
  }

  // varian exist
  return res.json({
    status: `success get varian`,
    data: varian,
  });
};
