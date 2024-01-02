const express = require('express');
const router = express.Router();
const {
    booksRequestHandler,
    getBookById
} = require('../controllers/bookController');

router.get('/', booksRequestHandler);
router.get('/:bookId', getBookById);

module.exports = router;