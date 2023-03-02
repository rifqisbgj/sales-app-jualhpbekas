const { Op } = require("sequelize");
const { Produk, GambarProduk, Varian } = require("../../../models");

module.exports = async (req, res) => {
  const last_create = Date.parse(req.query.lastCreate) || Date.parse(0);
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.q || "";

  let result = [];
  if (last_create == Date.parse(0)) {
    console.log("A");
    const produk = await Produk.findAll({
      where: {
        [Op.or]: [{ namaproduk: { [Op.like]: "%" + search + "%" } }],
      },
      limit: limit,
      include: [
        { model: GambarProduk, as: "gambarProduk", limit: 1 },
        { model: Varian, as: "varianProduk", attributes: ["namavarian"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    result = produk;
  } else {
    console.log("B");
    const produk = await Produk.findAll({
      where: {
        createdAt: {
          [Op.lt]: last_create,
        },
        [Op.or]: [{ namaproduk: { [Op.like]: "%" + search + "%" } }],
      },
      limit: limit,
      include: [
        { model: GambarProduk, as: "gambarProduk", limit: 1 },
        { model: Varian, as: "varianProduk", attributes: ["namavarian"] },
      ],
      order: [["createdAt", "DESC"]],
    });
    result = produk;
  }

  return res.json({
    status: "success",
    data: result,
    lastCreate: result.length ? result[result.length - 1].createdAt : 0,
    hasMore: result.length >= limit ? true : false,
  });
};
