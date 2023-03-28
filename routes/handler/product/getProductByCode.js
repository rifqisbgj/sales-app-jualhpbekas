const { Op } = require("sequelize");
const {
  Produk,
  GambarProduk,
  Varian,
  Merek,
  sequelize,
} = require("../../../models");

module.exports = async (req, res) => {
  const produk = await Produk.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
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
      {
        model: GambarProduk,
        as: "gambarProduk",
        limit: 1,
        attributes: ["id", "image"],
      },
      {
        model: Varian,
        as: "varianProduk",
        attributes: ["id", "namavarian"],
        required: false,
        include: [
          { model: Merek, as: "merk", attributes: ["id", "namamerek"] },
        ],
      },
    ],
  });

  return res.json({ status: "error", data: produk });
};
