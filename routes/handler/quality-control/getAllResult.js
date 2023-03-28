const { HasilQC, Produk, Users, sequelize } = require("../../../models");
const moment = require("moment");
const { Op } = require("sequelize");

module.exports = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const search = req.query.search_query || "";
  const offset = limit * page;
  const dateTwo = req.query.dateTwo || "";
  const dateOne = req.query.dateOne || "";
  let sqlFilter = {};

  if (req.user.data.role === "adminQC") {
    sqlFilter.id_adminqc = req.user.data.id;
  }

  if (dateOne !== "" && dateTwo !== "") {
    sqlFilter.createdAt = {
      [Op.between]: [moment(dateOne), moment(dateTwo).add(1, "days")],
    };
  }

  const sqlOptions = {
    where: {
      [Op.or]: [
        // get qc result by kodeQC
        { kodeQC: { [Op.iLike]: "%" + search + "%" } },
        // get qc result by kodeProduk, IMEI
        {
          qcProductKode: sequelize.where(sequelize.col("produkQC.kodeproduk"), {
            [Op.iLike]: "%" + search.toLowerCase() + "%",
          }),
        },
        {
          qcProductIMEI: sequelize.where(sequelize.col("produkQC.imei"), {
            [Op.iLike]: "%" + search.toLowerCase() + "%",
          }),
        },
      ],
      [Op.and]: [sqlFilter],
    },
    include: [
      {
        model: Produk,
        as: "produkQC",
        attributes: [
          "id",
          "imei",
          "kodeproduk",
          "slug",
          "statusproduk",
          "active",
        ],
        include: ["varianProduk"],
      },
      { model: Users, as: "qcBy", attributes: ["nama"] },
    ],
  };

  const totalRows = await HasilQC.count(sqlOptions);
  const totalPage = Math.ceil(totalRows / limit);

  sqlOptions.offset = offset;
  sqlOptions.limit = limit;
  sqlOptions.order = [["createdAt", "DESC"]];
  // menampilkan seluruh data hasil qc dengan kolom imei produk, kode QC,idQC dan nama admin
  const qc = await HasilQC.findAll(sqlOptions);

  return res.json({
    status: "success",
    data: qc,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage,
  });
};
