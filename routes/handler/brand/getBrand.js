const { Merek } = require("../../../models");

module.exports = async (req, res) => {
  //   mengambil data dari Pk berdasarkan params.id
  // include: ['varians'] diambil dari propery "as" pada model Mere
  const brand = await Merek.findByPk(req.params.id);
  // cek apakah id brand ada atau tidak
  if (!brand) {
    return res
      .status(404)
      .json({ status: "error", message: "Data tidak ditemukan" });
  }

  // ambil data merek dan varian dengan merek yang dicari
  return res.json({
    status: `success get detail from ${brand.namamerek}`,
    data: brand,
  });
};
