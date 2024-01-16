const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/tokenVerification');
const validator = require('../utils/validation');
const {
    getBooks,
    getBookById
} = require('../controllers/bookController');

router.use(verifyToken(authMode = 'soft'));
router.get('/', validator.getBooks, getBooks);
router.get('/:bookId', validator.getBookById, getBookById);

module.exports = router;