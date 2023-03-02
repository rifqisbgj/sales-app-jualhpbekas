const express = require("express");
const router = express.Router();
const qcHandler = require("./handler/quality-control");
const verifyLogin = require("../middleware/verifyUser");
const access = require("../middleware/permission");
// Store new qc result
router.post(
  "/store",
  verifyLogin,
  access("super", "adminQC"),
  qcHandler.createResult
);
// update qc result
router.put(
  "/update/:id",
  verifyLogin,
  access("super", "adminQC"),
  qcHandler.updateResult
);
// get list qc result
router.get(
  "/",
  verifyLogin,
  access("super", "adminQC"),
  qcHandler.getAllResult
);
// get detail qc result
router.get(
  "/detail/:id",
  verifyLogin,
  access("super", "adminQC"),
  qcHandler.detailResult
);
// delete qc result
router.delete(
  "/delete",
  verifyLogin,
  access("super", "adminQC"),
  qcHandler.deleteResult
);

module.exports = router;
