const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authorization.middleware');
const validator = require('../middlewares/validation.middleware');
const {
    getBooks,
    getBookById
} = require('../controllers/book.controller');

router.use(verifyToken(authMode = 'soft'));
router.get('/', validator.getBooks, getBooks);
router.get('/:bookId', validator.getBookById, getBookById);

module.exports = router;