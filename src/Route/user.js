const express = require("express");
const router = express.Router();
const UserController = require("../controller/UserController");
const multer = require("multer");
const upload = multer();

router.post("/register", UserController.register);
router.post("/send-email", UserController.sendEmail);
router.post("/check-email-exist", UserController.checkEmailAlreadyExists);
router.post("/login", UserController.login);
router.put("/change-password", UserController.changePassword);
router.post("/verify-code", UserController.verifyCode);
router.get("/get-users", UserController.getAllUsers);
router.get("/get-users-not-member", UserController.getUserNotMember);
router.post("/get-id", UserController.getId);

module.exports = router;
