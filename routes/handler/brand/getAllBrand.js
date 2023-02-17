const { Merek } = require("../../../models");

module.exports = async (req, res) => {
  const allData = await Merek.findAll({ attributes: ["namamerek"] });
  return res.json({
    status: "success",
    data: allData,
  });
};
