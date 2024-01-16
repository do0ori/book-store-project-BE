const express = require('express');
const router = express.Router();
const validator = require('../utils/validation');
const {
    signUp,
    logIn,
    passwordResetRequest,
    resetPassword
} = require('../controllers/userController');

router.post('/signup', validator.signUp, signUp);
router.post('/login', validator.logIn, logIn);
router.post('/reset-password', validator.passwordResetRequest, passwordResetRequest);
router.put('/reset-password', validator.resetPassword, resetPassword);

module.exports = router;