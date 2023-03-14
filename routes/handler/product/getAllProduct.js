const { Op } = require("sequelize");
const { Produk, GambarProduk, Varian } = require("../../../models");

module.exports = async (req, res) => {
  // ambil query lastCreate, jika tidak ada maka set dengan Date.parse(0)
  const last_create = Date.parse(req.query.lastCreate) || Date.parse(0);
  // limit dari data yg akan ditampilkan
  const limit = parseInt(req.query.limit) || 10;
  // ambil keyword search
  const search = req.query.q || "";
  // ambil query brand untuk filter brand
  const brand = req.query.brand;
  // ambil var query maxPrice, minPrice
  let { maxPrice, minPrice } = req.query;

  // object untuk menyimpan id mana saja yang akan ditampilkan
  const paramsQBrandFilter = {};
  // jika brand tersedia
  if (brand !== "" && typeof brand !== "undefined" && brand !== "null") {
    // array brand dengan format "value, value, dst.." akan displit dan disimpan menjadi obj
    const qBrand = brand.split(",").map((item) => ({
      id_merk: parseInt(item),
    }));

    // set obj where dengan value id brand yang akan difilter
    paramsQBrandFilter.where = {
      [Op.or]: qBrand,
    };
  }

  // jika minPrice tidak diatur
  if (minPrice === "null" || minPrice !== "undefined") minPrice = 0;
  // jika maxPrice tidak diatur
  if (maxPrice === "null" || maxPrice !== "undefined") maxPrice = 9999999;

  // menyimpan hasil pengambilan data produk dari db
  let result = [];
  // jika last_create default
  if (last_create == Date.parse(0)) {
    const produk = await Produk.findAll({
      where: {
        // search berdasarkan nama produk
        [Op.or]: [{ namaproduk: { [Op.like]: "%" + search + "%" } }],
        // filter berdasarkan rentang harga
        [Op.or]: [{ harga: { [Op.gte]: minPrice, [Op.lte]: maxPrice } }],
      },
      limit: limit,
      include: [
        { model: GambarProduk, as: "gambarProduk", limit: 1 },
        {
          model: Varian,
          as: "varianProduk",
          attributes: ["namavarian", "id_merk"],
          // filter berdasarkan brand
          where: paramsQBrandFilter.where,
        },
      ],
      order: [["createdAt", "DESC"]],
    });
    result = produk;
  } else {
    const produk = await Produk.findAll({
      where: {
        createdAt: {
          [Op.lt]: last_create,
        },
        [Op.or]: [{ namaproduk: { [Op.like]: "%" + search + "%" } }],
        [Op.or]: [{ harga: { [Op.gte]: minPrice, [Op.lte]: maxPrice } }],
      },
      limit: limit,
      include: [
        { model: GambarProduk, as: "gambarProduk", limit: 1 },
        {
          model: Varian,
          as: "varianProduk",
          attributes: ["namavarian", "id_merk"],
          where: paramsQBrandFilter.where,
        },
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
