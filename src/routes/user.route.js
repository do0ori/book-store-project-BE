const express = require('express');
const router = express.Router();
const validator = require('../middlewares/validation.middleware');
const userController = require('../controllers/user.controller');

router.post('/signup', validator.signUp, userController.signUp);
router.post('/login', validator.logIn, userController.logIn);
router.post('/reset-password', validator.passwordResetRequest, userController.passwordResetRequest);
router.put('/reset-password', validator.resetPassword, userController.resetPassword);

module.exports = router;