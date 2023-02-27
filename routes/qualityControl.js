const express = require("express");
const router = express.Router();
const qcHandler = require("./handler/quality-control");

// Store new qc result
router.post("/store", qcHandler.createResult);
// update qc result
router.put("/update/:id", qcHandler.updateResult);
// // get list qc result
router.get("/", qcHandler.getAllResult);
// // get detail qc result
router.get("/detail/:id", qcHandler.detailResult);
// // delete qc result
// router.delete("/delete", qcHandler.);

module.exports = router;
