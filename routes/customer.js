const express = require("express");
const router = express.Router();
const customerHandler = require("./handler/customer");

const verifyLogin = require("../middleware/verifyUser");
const access = require("../middleware/permission");

// Store new customer
router.post(
  "/store",
  verifyLogin,
  access("super", "adminSale"),
  customerHandler.createCustomer
);
// update a customer
router.put(
  "/update/:id",
  verifyLogin,
  access("super", "adminSale"),
  customerHandler.updateCustomer
);
// get list customer
router.get(
  "/",
  verifyLogin,
  access("super", "adminSale"),
  customerHandler.getAllCustomer
);
// get detail customer
router.get("/detail/:id", customerHandler.getCustomer);

module.exports = router;
