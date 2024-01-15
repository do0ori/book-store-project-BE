const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/tokenVerification');
const {
    getBooks,
    getBookById
} = require('../controllers/bookController');

router.use(verifyToken(authMode = 'soft'));
router.get('/', getBooks);
router.get('/:bookId', getBookById);

module.exports = router;