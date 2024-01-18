const express = require('express');
const router = express.Router();
const validator = require('../middlewares/validation.middleware');
const {
    signUp,
    logIn,
    passwordResetRequest,
    resetPassword
} = require('../controllers/user.controller');

router.post('/signup', validator.signUp, signUp);
router.post('/login', validator.logIn, logIn);
router.post('/reset-password', validator.passwordResetRequest, passwordResetRequest);
router.put('/reset-password', validator.resetPassword, resetPassword);

module.exports = router;