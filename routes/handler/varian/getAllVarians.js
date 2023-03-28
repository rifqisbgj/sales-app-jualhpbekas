const { Op } = require("sequelize");
const { Varian, Merek, Produk, sequelize } = require("../../../models");

module.exports = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || "";
  const offset = limit * page;

  const totalRows = await Varian.count({
    where: {
      [Op.or]: [
        {
          namavarian: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    },
    include: [
      {
        model: Merek,
        as: "merk",
        where: {
          [Op.or]: [
            {
              namamerek: {
                [Op.like]: "%" + search + "%",
              },
            },
          ],
        },
      },
    ],
  });

  const totalPage = Math.ceil(totalRows / limit);
  // get varian with brand and number of product
  const allData = await Varian.findAll({
    where: {
      [Op.or]: [
        {
          namavarian: {
            [Op.like]: "%" + search + "%",
          },
        },
      ],
    },
    include: [
      // get brand name
      {
        model: Merek,
        as: "merk",
        where: {
          [Op.or]: [
            {
              namamerek: {
                [Op.like]: "%" + search + "%",
              },
            },
          ],
        },
      },
      // get number of product
      { model: Produk, as: "produk" },
    ],
    attributes: ["namavarian", "id", "createdAt"],
    offset: offset,
    limit: limit,
    order: [["createdAt", "DESC"]],
  });

  // res data varian
  return res.json({
    status: "success get all varians",
    data: allData,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage,
  });
};
