const express = require("express");
const router = express.Router();
const brandHandler = require("./handler/brand");

/* GET users listing. */
router.post("/store", brandHandler.createBrand);
router.put("/update/:id", brandHandler.updateBrand);
router.get("/", brandHandler.getAllBrand);
router.get("/:id", brandHandler.detailBrand);

module.exports = router;
