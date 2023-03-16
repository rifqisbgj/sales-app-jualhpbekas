const { Customer } = require("../../../models");
const validateUUID = require("../../../helper/validateUUID");
module.exports = async (req, res) => {
  // validasi UUID berdasarkan params id
  if (!validateUUID(req.params.id))
    return res
      .status(400)
      .json([{ status: "error", message: "Invalid customer identity" }]);

  //   get data customer by PK
  const cus = await Customer.findByPk(req.params.id, {
    include: ["transaksi"],
  });
  //   if cus not found
  if (!cus) {
    return res
      .status(404)
      .json([{ status: "error", message: "Customer not found" }]);
  }
  //   res after success create customer
  return res.json({ status: "success", data: cus });
};
