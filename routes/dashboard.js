const express = require("express");
const router = express.Router();
const dashboard = require("./handler/dashboard/getDashboard");

const verifyLogin = require("../middleware/verifyUser");
const access = require("../middleware/permission");

// total customer
router.get(
  "/totalCustomer",
  verifyLogin,
  access("super"),
  dashboard.getTotalAdmin
);
// total admin
router.get(
  "/totalAdmin",
  verifyLogin,
  access("super"),
  dashboard.getTotalAdmin
);

// total pendapatan
router.get(
  "/pendapatan",
  verifyLogin,
  access("super"),
  dashboard.totalPendapatan
);

// list pendapatan mingguan
router.get("/tr", verifyLogin, access("super"), dashboard.getTransaction);
// list admin dengan penjualan terbanyak ke terkecil
router.get(
  "/trByAdmin",
  verifyLogin,
  access("super"),
  dashboard.transactionByAllAdmin
);
// jumlah produk yang siap jual
router.get(
  "/prdReady",
  verifyLogin,
  access("super", "adminSale", "adminQC"),
  dashboard.getProductReady
);
// jumlah produk belum siap jual
router.get(
  "/prdNotReady",
  verifyLogin,
  access("super", "adminSale", "adminQC"),
  dashboard.getProductNotReady
);
// jumlah produk yang terjual
router.get(
  "/prdSold",
  verifyLogin,
  access("super", "adminSale", "adminQC"),
  dashboard.getProductSold
);
// jumlah produk yang telah di QC
router.get(
  "/prdQC",
  verifyLogin,
  access("super", "adminSale", "adminQC"),
  dashboard.getProductQC
);
// jumlah produk yang belum di QC
router.get(
  "/prdNotQC",
  verifyLogin,
  access("super", "adminSale", "adminQC"),
  dashboard.getProductNotQC
);
// jumlah qc yang dilakukan admin
router.get(
  "/qcByAdmin",
  verifyLogin,
  access("super", "adminQC"),
  dashboard.getQCByAdmin
);
// jumlah transaksi yang dilakukan admin
router.get(
  "/transByAdmin",
  verifyLogin,
  access("super", "adminSale"),
  dashboard.getTransactionByAdmin
);

// jumlah varian yang terjual
router.get(
  "/varianSold",
  verifyLogin,
  access("super", "adminSale"),
  dashboard.getVarianSold
);

// jumlah varian yang terjual
router.get(
  "/brandSold",
  verifyLogin,
  access("super", "adminSale"),
  dashboard.getBrandSold
);
module.exports = router;
