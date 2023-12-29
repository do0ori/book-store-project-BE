const express = require('express');
const router = express.Router();
// const jwt = require('jsonwebtoken');

const signUp = (req, res) => {
    res.json("회원가입");
};

const signIn = (req, res) => {
    res.json("로그인");
};

const passwordResetRequest = (req, res) => {
    res.json("비밀번호 재설정 요청");
};

const resetPassword = (req, res) => {
    res.json("비밀번호 재설정");
};

router.post('/join', signUp);

router.post('/login', signIn);

router.route('/reset-password')
    .post(passwordResetRequest)
    .put(resetPassword);

module.exports = router;