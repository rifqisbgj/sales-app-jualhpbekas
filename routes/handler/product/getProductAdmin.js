const { Op } = require("sequelize");
const { Varian, Produk, HasilQC, sequelize } = require("../../../models");

module.exports = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || "";
  const status = req.query.status || "";
  const active = req.query.active || "";
  let minPrice = req.query.minPrice || 0;
  let maxPrice = req.query.maxPrice || 99999999999;
  const offset = limit * page;

  // jika minPrice tidak diatur
  if (minPrice === "null" || minPrice === "undefined") minPrice = 0;
  // jika maxPrice tidak diatur
  if (maxPrice === "null" || maxPrice === "undefined") maxPrice = 999999999;

  let sqlFilter = {};
  // jika user menggunakan filter status aktif produk
  if (active !== "") {
    sqlFilter.active = active;
  }
  // jika user menggunakan filter status produk
  if (status !== "") {
    sqlFilter.statusproduk = status;
  }
  // jika user menggunakan filter harga
  if (minPrice !== null || maxPrice !== null) {
    sqlFilter.harga = { [Op.gte]: minPrice, [Op.lte]: maxPrice };
  }

  const sqlOptionts = {
    where: {
      [Op.or]: [
        // get product by product code search
        { kodeproduk: { [Op.iLike]: "%" + search + "%" } },
        { imei: { [Op.iLike]: "%" + search + "%" } },
        // get product by varian name search
        {
          varianproduk: sequelize.where(
            sequelize.fn("lower", sequelize.col("varianProduk.namavarian")),
            { [Op.like]: "%" + search.toLowerCase() + "%" }
          ),
        },
      ],
      [Op.and]: [sqlFilter],
    },
    include: [
      {
        model: Varian,
        as: "varianProduk",
      },
      {
        model: HasilQC,
        as: "qcProduct",
      },
    ],
  };

  const totalRows = await Produk.count(sqlOptionts);

  const totalPage = Math.ceil(totalRows / limit);
  sqlOptionts.attributes = [
    "id",
    "imei",
    "kodeproduk",
    "harga",
    "statusproduk",
    "active",
    "slug",
  ];
  sqlOptionts.offset = offset;
  sqlOptionts.limit = limit;
  sqlOptionts.order = [["createdAt", "DESC"]];
  //   // get all product with varian
  const allData = await Produk.findAll(sqlOptionts);

  // res data varian
  return res.json({
    status: "success get all product",
    data: allData,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage,
  });
};
