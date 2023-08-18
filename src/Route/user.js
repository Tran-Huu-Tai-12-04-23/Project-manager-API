const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController');
const multer = require('multer');
const upload = multer();

router.post('/register', UserController.register);
router.post('/send-email', UserController.sendEmail);
router.post('/check-email-exist', UserController.checkEmailAlreadyExists);
router.post('/login', UserController.login);
router.put('/change-password', UserController.changePassword);
router.post('/verify-code', UserController.verifyCode);
router.get('/get-users', UserController.getAllUsers);
router.get('/get-users-not-member', UserController.getUserNotMember);
router.post('/get-id', UserController.getId);
router.post('/profile/create', UserController.createNewProfile);
router.get('/profile/check-exist', UserController.checkProfileExist);
router.get('/profile', UserController.getProfile);
router.put('/profile', UserController.updateProfile);
router.put('/avatar', UserController.updateAvatarUser);
router.put('/profile/background', UserController.updateBackgroundProfile);

module.exports = router;
