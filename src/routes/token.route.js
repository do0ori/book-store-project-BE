const express = require('express');
const router = express.Router();
const validator = require('../middlewares/validation.middleware');
const tokenController = require('../controllers/token.controller');

router.get('/', validator.refreshToken, tokenController.refreshToken);

module.exports = router;