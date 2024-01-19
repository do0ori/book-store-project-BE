const { StatusCodes } = require('http-status-codes');
const { HttpError } = require('../middlewares/errorHandler.middleware');
const convertSnakeToCamel = require('../utils/responseFormatter.util');

const getBooks = async (conn, userId, categoryId, recent, limit, page) => {
    const conditions = {
        category: categoryId ? "category_id = ?" : null,
        recent: recent === "true" ? "published_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()" : null
    };

    const conditionClauses = Object.values(conditions).filter(Boolean);
    const whereClause = conditionClauses.length ? `WHERE ${conditionClauses.join(" AND ")}` : "";

    const offset = limit * (page - 1);

    let sql = `
            SELECT
                *,
                (SELECT COUNT(*) FROM likes WHERE book_id = books.id) AS likes,
                EXISTS (SELECT 1 FROM likes WHERE user_id = ? AND book_id = books.id) AS liked
            FROM books
            ${whereClause}
            LIMIT ? OFFSET ?
        `;
    let values = categoryId ? [userId, categoryId, +limit, offset] : [userId, +limit, offset];
    const [rows] = await conn.query(sql, values);

    let data = {};
    if (rows.length) {
        data.books = rows;
    } else {
        throw new HttpError(StatusCodes.NOT_FOUND, "존재하지 않는 페이지입니다.");
    }

    sql = `SELECT COUNT(*) AS total FROM books ${whereClause}`;
    values = categoryId ? [categoryId] : [];
    const [result] = await conn.query(sql, values);

    data.pagination = {
        currentPage: +page,
        totalCount: result[0].total
    };

    return convertSnakeToCamel(data);
};

const getBookById = async (conn, userId, bookId) => {
    const sql = `
        SELECT
            books.*,
            category.name AS categoryName,
            (SELECT COUNT(*) FROM likes WHERE book_id = books.id) AS likes,
            EXISTS (SELECT 1 FROM likes WHERE user_id = ? AND book_id = books.id) AS liked
        FROM books
        LEFT JOIN category
        ON books.category_id = category.id
        WHERE books.id = ?
    `;
    const values = [userId, bookId];
    const [rows] = await conn.query(sql, values);

    if (rows[0]) {
        return convertSnakeToCamel(rows[0]);
    } else {
        throw new HttpError(StatusCodes.NOT_FOUND, "존재하지 않는 도서입니다.");
    }
};

module.exports = {
    getBooks,
    getBookById
};