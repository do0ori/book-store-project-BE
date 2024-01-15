const { HttpError } = require('../utils/errorHandler');
const { StatusCodes } = require('http-status-codes');

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

        const offset = limit * (page - 1);
        let sql = `
            SELECT SQL_CALC_FOUND_ROWS
                *,
                (SELECT COUNT(*) FROM likes WHERE book_id = books.id) AS like_count,
                EXISTS(SELECT 1 FROM likes WHERE user_id = ? AND book_id = books.id) AS liked
            FROM books
            ${whereClause}
            LIMIT ? OFFSET ?
        `;
        const values = categoryId ? [userId, categoryId, parseInt(limit), offset] : [userId, parseInt(limit), offset];
        const [rows] = await req.connection.query(sql, values);
        
        let data = {};
        if (rows.length) {
            data.books = rows;
        } else {
            throw new HttpError(StatusCodes.NOT_FOUND, "존재하지 않는 페이지입니다.");
        }
        
        sql = `SELECT FOUND_ROWS() AS total`;
        const [result] = await req.connection.query(sql);

        data.pagination = {
            currentPage: parseInt(page),
            totalCount: result[0].total
        }
        res.status(StatusCodes.OK).json(data);
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