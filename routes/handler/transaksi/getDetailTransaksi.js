const { Transaksi } = require("../../../models");
module.exports = async (req, res) => {
  //   get data transaksi
  const transaksi = await Transaksi.findOne({
    where: { kode_invoice: req.params.invoice },
    include: "transaksiCustomer",
  });
  // jika transaksi tidak tersedia
  if (!transaksi) {
    return res
      .status(404)
      .json({ status: "error", message: "Transaksi tidak tersedia" });
  }
  //   res after success create transaksi
  return res.json({ status: "success", data: transaksi });
};
