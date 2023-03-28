const { Transaksi, Customer, Users } = require("../../../models");
const moment = require("moment");
const { Op } = require("sequelize");
module.exports = async (req, res) => {
  // defaul akan berisi tanggal sekarang
  const dateTwo = req.query.dateTwo || moment().format("YYYY-MM-DD");
  // default akan berisi 7 hari sebelum tanggal sekarang
  const dateOne =
    req.query.dateOne || moment().subtract(14, "d").format("YYYY-MM-DD");
  const page = parseInt(req.query.page) || 0;
  const limit = parseInt(req.query.limit) || 10;
  const offset = limit * page;

  //   cek filter tanggal
  if (dateOne > dateTwo) {
    return res.status(400).json([
      {
        status: "error",
        message: "Tanggal pertama tidak boleh lebih besar dari tanggal kedua",
      },
    ]);
  }
  // add query for get data from date range
  // as a default, the endDate will be set to time 00:00:00. Moment add 1 days to get 24H on end date
  let sqlFilter = {};
  sqlFilter.createdAt = {
    [Op.between]: [moment(dateOne), moment(dateTwo).add(1, "days")],
  };

  //   get data transaksi
  let getByAdmin = {};
  if (req.user.data.role === "adminSale") {
    getByAdmin.where = { id_admin: req.user.data.id, [Op.and]: [sqlFilter] };
  } else {
    getByAdmin.where = { [Op.and]: [sqlFilter] };
  }

  const sqlOptionts = {
    include: [
      { model: Customer, as: "transaksiCustomer" },
      { model: Users, as: "adminTransaksi", attributes: ["nama"] },
    ],
    where: getByAdmin.where,
  };
  const totalRows = await Transaksi.count(sqlOptionts);
  const totalPage = Math.ceil(totalRows / limit);

  sqlOptionts.offset = offset;
  sqlOptionts.limit = limit;
  sqlOptionts.order = [["createdAt", "DESC"]];
  const transaksi = await Transaksi.findAll(sqlOptionts);
  //   res after success create transaksi
  return res.json({
    status: "success",
    data: transaksi,
    page: page,
    limit: limit,
    totalRows: totalRows,
    totalPage: totalPage,
  });
};
