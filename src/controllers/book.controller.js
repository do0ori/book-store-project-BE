const bookService = require('../services/book.service');
const { StatusCodes } = require('http-status-codes');
const { asyncHandlerWrapper } = require('../middlewares/wrapper.middleware');

const getBooks = async (req, res) => {
    const userId = req.decodedToken?.userId;
    const { categoryId, recent, limit, page } = req.query;

    const data = await bookService.getBooks(req.conn, userId, categoryId, recent, limit, page);

    res.status(StatusCodes.OK).json(data);
};

const getBookById = async (req, res) => {
    const userId = req.decodedToken?.userId;
    const { bookId } = req.params;

    const data = await bookService.getBookById(req.conn, userId, bookId);

    res.status(StatusCodes.OK).json(data);
};

module.exports = {
    getBooks: asyncHandlerWrapper(getBooks),
    getBookById: asyncHandlerWrapper(getBookById)
};