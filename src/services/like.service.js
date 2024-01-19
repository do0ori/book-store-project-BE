const { HttpError } = require('../middlewares/errorHandler.middleware');
const { StatusCodes } = require('http-status-codes');
const { isLikeExist } = require('../utils/existanceCheck.util');

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
    addToLikes,
    removeFromLikes
};