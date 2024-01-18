const { HttpError } = require('../middlewares/errorHandler.middleware');
const { StatusCodes } = require('http-status-codes');

const addToLikes = async (conn, userId, bookId) => {
    const sql = "INSERT INTO likes (user_id, book_id) VALUES (?, ?)";
    const values = [userId, bookId];
    const [result] = await conn.query(sql, values);

    return result;
};

const removeFromLikes = async (conn, userId, bookId) => {
    const sql = "DELETE FROM likes WHERE user_id = ? AND book_id = ?";
    const values = [userId, bookId];
    const [result] = await conn.query(sql, values);

    if (result.affectedRows) {
        return result;
    } else {
        throw new HttpError(StatusCodes.BAD_REQUEST);
    }
};

module.exports = {
    addToLikes,
    removeFromLikes
};