const { HttpError } = require('../utils/errorHandler');
const { StatusCodes } = require('http-status-codes');

const addToCart = async (req, res, next) => {
    try {
        const userId = req.decodedToken.uid;
        const { bookId, quantity } = req.body;

        const sql = "INSERT INTO cart (user_id, book_id, quantity) VALUES (?, ?, ?)";
        const values = [userId, bookId, quantity];
        const [result] = await req.connection.query(sql, values);

        res.status(StatusCodes.CREATED).json(result);
        next();
    } catch (error) {
        next(error);
    }
};

const getCartItems = async (req, res, next) => {
    try {
        const { selected } = req.body;

        let sql = `
            SELECT
                item_id AS itemId,
                books.id AS bookId,
                title,
                summary,
                quantity,
                price
            FROM cart
            LEFT JOIN books
            ON cart.book_id = books.id
            WHERE user_id = ?
        `;
        const values = [req.decodedToken.uid];
        if (selected) {
            sql += "AND item_id IN (?)";
            values.push(selected);
        }
        let [rows] = await req.connection.query(sql, values);

        res.status(StatusCodes.OK).json(rows);
        next();
    } catch (error) {
        next(error);
    }
};

const removeFromCart = async (req, res, next) => {
    try {
        const { itemId } = req.params;

        const sql = "DELETE FROM cart WHERE item_id = ?";
        const [result] = await req.connection.query(sql, itemId);

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
    addToCart,
    getCartItems,
    removeFromCart
};