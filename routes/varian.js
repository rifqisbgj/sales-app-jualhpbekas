const express = require("express");
const router = express.Router();
const varianHandler = require("./handler/varian");

// store new varian
router.post("/store", varianHandler.createVarian);
router.put("/update/:id", varianHandler.updateVarian);
// get all varian with brand name
router.get("/", varianHandler.getAllVarians);
// detail varian with product list
router.get("/detail/:id", varianHandler.detailVarian);
// detail for edit varian
router.get("/edit/:id", varianHandler.getVarian);
// delete varian
router.delete("/delete", varianHandler.deleteVarian);

module.exports = router;
