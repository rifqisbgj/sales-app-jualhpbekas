const { Merek, Varian, sequelize } = require("../../../models");

module.exports = async (req, res) => {
  const allData = await Merek.findAll({
    // ambil atribut varian
    include: [{ model: Varian, as: "varians", attributes: [] }],
    // ambil namamerek, id, dan jumlah varian
    attributes: [
      "namamerek",
      "id",
      [sequelize.fn("COUNT", sequelize.col("varians.id")), "totalVarian"],
    ],
    // group By id merek
    group: ["Merek.id"],
    // tampilkan berdasarkan brand terlama
    order: [["createdAt", "ASC"]],
  });
  return res.json({
    status: "success",
    data: allData,
  });
};
