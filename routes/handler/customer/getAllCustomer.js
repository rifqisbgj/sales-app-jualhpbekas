const { Customer } = require("../../../models");
module.exports = async (req, res) => {
  //   get data customer
  const cus = await Customer.findAll();
  //   res after success create customer
  return res.json({ status: "success", data: cus });
};
