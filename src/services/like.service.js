const { HttpError } = require('../middlewares/errorHandler.middleware');
const { StatusCodes } = require('http-status-codes');

/**
 * Checks whether a like record exists for a given user and book.
 * @param {Object} conn - The database connection object.
 * @param {number} userId - The ID of the user.
 * @param {number} bookId - The ID of the book.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the like record exists (true) or not (false).
 */
const isLikeExist = async (conn, userId, bookId) => {
    const sql = "SELECT EXISTS (SELECT 1 FROM likes WHERE user_id = ? AND book_id = ?) AS exist";
    const values = [userId, bookId];
    const [result] = await conn.query(sql, values);

    return result[0].exist === 1;
};

const addToLikes = async (conn, userId, bookId) => {
    const exists = await isLikeExist(conn, userId, bookId);

    if (!exists) {
        const sql = "INSERT INTO likes (user_id, book_id) VALUES (?, ?)";
        const values = [userId, bookId];
        const [result] = await conn.query(sql, values);

        return result;
    } else {
        throw new HttpError(StatusCodes.CONFLICT, "이미 처리된 요청입니다.");
    }
};

const removeFromLikes = async (conn, userId, bookId) => {
    const exists = await isLikeExist(conn, userId, bookId);

    if (exists) {
        const sql = "DELETE FROM likes WHERE user_id = ? AND book_id = ?";
        const values = [userId, bookId];
        const [result] = await conn.query(sql, values);

        if (result.affectedRows) {
            return result;
        } else {
            throw new HttpError(StatusCodes.BAD_REQUEST);
        }
    } else {
        throw new HttpError(StatusCodes.CONFLICT, "이미 처리된 요청입니다.");
    }
};

module.exports = {
    isLikeExist,
    addToLikes,
    removeFromLikes
};