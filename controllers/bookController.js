const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

/**
 * @returns {Object}
 * - If the request includes the query parameters "limit" and "page", the response will contain the paginated book data.
 * - Otherwise, the response will be { "total": total length of book data }.
 * @note "categoryId" and "recent" query parameters are optional.
 */
const getBooks = (req, res) => {
    const { userId } = req.body;
    const { categoryId, recent, limit, page } = req.query;

    const conditions = {
        category: categoryId ? "category_id = ?" : null,
        recent: recent === "true" ? "published_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()" : null
    };
    const conditionClauses = Object.values(conditions).filter(Boolean);
    const whereClause = conditionClauses.length ? `WHERE ${conditionClauses.join(" AND ")}` : "";

    let sql, values;
    if (limit && page) {
        const offset = limit * (page - 1);
        sql = `
            SELECT
                *,
                (SELECT COUNT(*) FROM likes WHERE book_id = books.id) AS like_count,
                EXISTS(SELECT * FROM likes WHERE user_id = ? AND book_id = books.id) AS liked
            FROM books
            ${whereClause}
            LIMIT ? OFFSET ?
        `;
        values = categoryId ? [userId, categoryId, parseInt(limit), offset] : [userId, parseInt(limit), offset];
    } else {
        sql = `SELECT COUNT(*) AS total FROM books ${whereClause}`;
        values = categoryId ? [categoryId] : [];
    }

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
    const { userId } = req.body;
    const { bookId } = req.params;

    const sql = `
        SELECT
            books.*,
            category.name AS category_name,
            (SELECT COUNT(*) FROM likes WHERE book_id = books.id) AS like_count,
            EXISTS(SELECT * FROM likes WHERE user_id = ? AND book_id = books.id) AS liked
        FROM books
        LEFT JOIN category
        ON books.category_id = category.id
        WHERE books.id = ?
    `;
    const values = [userId, bookId];
    conn.query(
        sql, values,
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