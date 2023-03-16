const { Transaksi } = require("../../../models");
module.exports = async (req, res) => {
  //   get data transaksi
  const transaksi = await Transaksi.findAll({
    include: "transaksiCustomer",
  });
  //   res after success create transaksi
  return res.json({ status: "success", data: transaksi });
};
