const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserController");

router.post("/register", UserController.register);
router.post("/send-email", UserController.sendEmail);
router.post("/check-email-exist", UserController.checkEmailAlreadyExists);
router.post("/login", UserController.login);

module.exports = router;
