const { HttpError } = require('../utils/errorHandler');
const { StatusCodes } = require('http-status-codes');

const addToLikes = async (req, res, next) => {
    try {
        const sql = "INSERT INTO likes (user_id, book_id) VALUES (?, ?)";
        const values = [req.body.userId, req.params.bookId];
        const [result] = await req.connection.query(sql, values);
    
        res.status(StatusCodes.CREATED).json(result);
        next();
    } catch (error) {
        next(error);
    }
};

const removeFromLikes = async (req, res, next) => {
    try {
        const sql = "DELETE FROM likes WHERE user_id = ? AND book_id = ?";
        const values = [req.body.userId, req.params.bookId];
        const [result] = await req.connection.query(sql, values);
        
        if (result.affectedRows) {
            res.status(StatusCodes.OK).json(result);
        } else {
            throw new HttpError(StatusCodes.BAD_REQUEST);
        }
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    addToLikes,
    removeFromLikes
};