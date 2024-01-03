const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const booksRequestHandler = (req, res) => {
    // 추후 express-validator 사용 (지금은 간단히 분기 로직 구현)
    const { categoryId, new: isNew } = req.query;
    if (categoryId || isNew) {
        getBooksByCategory(req, res);
    } else {
        getAllBooks(req, res);
    }
};

const getAllBooks = (req, res) => {
    const sql = "SELECT * FROM books";
    conn.query(
        sql,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(results);
        }
    );
};

const getBookById = (req, res) => {
    const { bookId } = req.params;
    const sql = "SELECT * FROM books WHERE id = ?";
    conn.query(
        sql, bookId,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if (results[0]) {
                return res.status(StatusCodes.OK).json(results[0]);
            } else {
                return res.status(StatusCodes.NOT_FOUND).end();
            }
        }
    );
};

const getBooksByCategory = (req, res) => {
    // 지금은 categoryId만 고려
    const { categoryId, new: isNew } = req.query;
    const sql = "SELECT * FROM books WHERE category_id = ?";
    conn.query(
        sql, categoryId,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if (results.length) {
                return res.status(StatusCodes.OK).json(results);
            } else {
                return res.status(StatusCodes.NOT_FOUND).end();
            }
        }
    );
};

module.exports = {
    booksRequestHandler,
    getBookById
};