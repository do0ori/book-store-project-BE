const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authorization.middleware');
const validator = require('../middlewares/validation.middleware');
const bookController = require('../controllers/book.controller');

router.use(verifyToken(authMode = 'soft'));
router.get('/', validator.getBooks, bookController.getBooks);
router.get('/:bookId', validator.getBookById, bookController.getBookById);

module.exports = router;