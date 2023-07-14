const express = require("express");
const router = express.Router();
const LinkController = require("../controller/LinkController");


router.get("/authentication-link-invite", LinkController.authenticationLinkInvite);
router.post("/create-link-invite", LinkController.sendLinkToInvite);

module.exports = router;
