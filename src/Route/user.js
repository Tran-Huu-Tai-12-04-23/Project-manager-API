const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserController");

router.post("/register", UserController.register);
router.post("/send-email", UserController.sendEmail);

module.exports = router;
