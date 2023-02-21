const { Merek, Varian } = require("../../../models");

module.exports = async (req, res) => {
  /* mengambil data dari Pk berdasarkan params.id, kemudian ambil data varian HP dengan id merek tersebut
   dengan value : nama merek, dan nama varian pada merek tersebut
   */
  // include: ['varians'] diambil dari propery "as" pada model Merek
  const brand = await Merek.findByPk(req.params.id, {
    attributes: ["namamerek"],
    include: [{ model: Varian, as: "varians", attributes: ["namavarian"] }],
  });
  // cek apakah id brand ada atau tidak
  if (!brand) {
    return res
      .status(404)
      .json({ status: "error", message: "Data tidak ditemukan" });
  }

  // ambil data merek dan varian dengan merek yang dicari
  return res.json({
    status: `success get detail with varians from ${brand.namamerek}`,
    data: brand,
  });
};
