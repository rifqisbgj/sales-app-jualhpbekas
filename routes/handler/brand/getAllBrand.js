const { Merek, Varian, sequelize } = require("../../../models");

module.exports = async (req, res) => {
  const allData = await Merek.findAll({
    // get data varian from brand
    include: [{ model: Varian, as: "varians", attributes: [] }],
    // get count varian
    attributes: [
      "namamerek",
      [sequelize.fn("COUNT", sequelize.col("varians.id")), "totalVarian"],
    ],
    // group By Merek.Id
    group: ["Merek.id"],
  });
  return res.json({
    status: "success",
    data: allData,
  });
};
