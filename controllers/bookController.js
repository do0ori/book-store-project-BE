const { HttpError } = require('../utils/errorHandler');
const { StatusCodes } = require('http-status-codes');

/**
 * @returns {Object}
 * - If the request includes the query parameters "limit" and "page", the response will contain the paginated book data.
 * - Otherwise, the response will be { "total": total length of book data }.
 * @note "categoryId" and "recent" query parameters are optional.
 */
const getBooks = async (req, res, next) => {
    try {
        const userId = req.decodedToken?.uid;
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
                    EXISTS(SELECT 1 FROM likes WHERE user_id = ? AND book_id = books.id) AS liked
                FROM books
                ${whereClause}
                LIMIT ? OFFSET ?
            `;
            values = categoryId ? [userId, categoryId, parseInt(limit), offset] : [userId, parseInt(limit), offset];
        } else {
            sql = `SELECT COUNT(*) AS total FROM books ${whereClause}`;
            values = categoryId ? [categoryId] : [];
        }
        const [rows] = await req.connection.query(sql, values);

        if (rows.length) {
            res.status(StatusCodes.OK).json(rows);
        } else {
            throw new HttpError(StatusCodes.NOT_FOUND, "존재하지 않는 페이지입니다.");
        }
        next();
    } catch (error) {
        next(error);
    }
};

const getBookById = async (req, res, next) => {
    try {
        const userId = req.decodedToken?.uid;
        const { bookId } = req.params;

        const sql = `
            SELECT
                books.*,
                category.name AS category_name,
                (SELECT COUNT(*) FROM likes WHERE book_id = books.id) AS like_count,
                EXISTS(SELECT 1 FROM likes WHERE user_id = ? AND book_id = books.id) AS liked
            FROM books
            LEFT JOIN category
            ON books.category_id = category.id
            WHERE books.id = ?
        `;
        const values = [userId, bookId];
        const [rows] = await req.connection.query(sql, values);
        if (rows[0]) {
            res.status(StatusCodes.OK).json(rows[0]);
        } else {
            throw new HttpError(StatusCodes.NOT_FOUND, "존재하지 않는 도서입니다.");
        }
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getBooks,
    getBookById
};