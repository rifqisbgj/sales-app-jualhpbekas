const { Varian, Merek, Produk, sequelize } = require("../../../models");

module.exports = async (req, res) => {
  // get varian with brand and number of product
  const allData = await Varian.findAll({
    include: [
      // get brand name
      { model: Merek, as: "merk", attributes: ["namamerek"] },
      // get number of product
      { model: Produk, as: "produk", attributes: [] },
    ],
    attributes: [
      "namavarian",
      [sequelize.fn("COUNT", sequelize.col("produk.id")), "productCount"],
    ],
    group: ["Varian.id", "merk.id"],
  });

  // res data varian
  return res.json({
    status: "success get all varians",
    data: allData,
  });
};
