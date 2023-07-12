const express = require("express");
const router = express.Router();
const ColController = require("../controller/ColController");

router.post("/create-new-col", ColController.addColumn);
router.delete("/remove-col", ColController.removeColumn);

module.exports = router;
