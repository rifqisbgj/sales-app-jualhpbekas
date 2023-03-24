const { Op } = require("sequelize");
const { Produk, GambarProduk, Varian, sequelize } = require("../../../models");

module.exports = async (req, res) => {
  const produk = await Produk.findAll({
    where: {
      [Op.or]: [
        // get product by product code search
        { kodeproduk: { [Op.like]: "%" + req.params.kodeproduk + "%" } },
        // get product by varian name search
        {
          varianproduk: sequelize.where(
            sequelize.fn("lower", sequelize.col("varianProduk.namavarian")),
            { [Op.like]: "%" + req.params.kodeproduk.toLowerCase() + "%" }
          ),
        },
      ],
      active: true,
      statusproduk: "SJ",
    },
    include: [
      { model: GambarProduk, as: "gambarProduk", limit: 1 },
      {
        model: Varian,
        as: "varianProduk",
        attributes: ["namavarian"],
        required: false,
      },
    ],
  });

  return res.json({ status: "error", data: produk });
};
