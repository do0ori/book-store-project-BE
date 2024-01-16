const { HttpError } = require('../middlewares/errorHandler');
const { StatusCodes } = require('http-status-codes');
const { executeHandler } = require('../middlewares/handlerWrapper');

const addToLikes = async (req, res) => {
    const sql = "INSERT INTO likes (user_id, book_id) VALUES (?, ?)";
    const values = [req.decodedToken.uid, req.params.bookId];
    const [result] = await req.connection.query(sql, values);

    res.status(StatusCodes.CREATED).json(result);
};

const removeFromLikes = async (req, res) => {
    const sql = "DELETE FROM likes WHERE user_id = ? AND book_id = ?";
    const values = [req.decodedToken.uid, req.params.bookId];
    const [result] = await req.connection.query(sql, values);

    if (result.affectedRows) {
        res.status(StatusCodes.OK).json(result);
    } else {
        throw new HttpError(StatusCodes.BAD_REQUEST);
    }
};

module.exports = {
    addToLikes: executeHandler(addToLikes),
    removeFromLikes: executeHandler(removeFromLikes)
};