const express = require('express');
const router = express.Router();
const {
    signUp,
    logIn,
    passwordResetRequest,
    resetPassword
} = require('../controller/userController');

router.post('/signup', signUp);
router.post('/login', logIn);
router.post('/reset-password', passwordResetRequest);
router.put('/reset-password', resetPassword);

module.exports = router;