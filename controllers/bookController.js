const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const getBooks = (req, res) => {
    // limit과 page는 무조건 들어온다고 가정
    const { categoryId, recent, limit, page } = req.query;

    const conditions = {
        category: categoryId ? "category_id = ?" : null,
        recent: recent === "true" ? "published_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()" : null
    };
    const conditionClauses = Object.values(conditions).filter(Boolean);
    const whereClause = conditionClauses.length ? `WHERE ${conditionClauses.join(" AND ")}` : "";
    const offset = limit * (page - 1);

    const sql = `
        SELECT * FROM books
        ${whereClause}
        LIMIT ? OFFSET ?
    `;
    const values = categoryId ? [categoryId, parseInt(limit), offset] : [parseInt(limit), offset];
    conn.query(
        sql, values,
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

const getBookById = (req, res) => {
    const { bookId } = req.params;

    const sql = `
        SELECT books.*, category.name AS category_name
        FROM books LEFT JOIN category
        ON books.category_id = category.id
        WHERE books.id = ?
    `;
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

module.exports = {
    getBooks,
    getBookById
};