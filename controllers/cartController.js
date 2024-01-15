const { HttpError } = require('../utils/errorHandler');
const { StatusCodes } = require('http-status-codes');
const { executeHandler } = require('../utils/handlerWrapper');

const addToCart = async (req, res) => {
    const userId = req.decodedToken.uid;
    const { bookId, quantity } = req.body;

    const sql = "INSERT INTO cart (user_id, book_id, quantity) VALUES (?, ?, ?)";
    const values = [userId, bookId, quantity];
    const [result] = await req.connection.query(sql, values);

    res.status(StatusCodes.CREATED).json(result);
};

const getCartItems = async (req, res) => {
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
};

const removeFromCart = async (req, res) => {
    const { itemId } = req.params;

    const sql = "DELETE FROM cart WHERE item_id = ?";
    const [result] = await req.connection.query(sql, itemId);

    if (result.affectedRows) {
        res.status(StatusCodes.OK).json(result);
    } else {
        throw new HttpError(StatusCodes.BAD_REQUEST);
    }
};

module.exports = {
    addToCart: executeHandler(addToCart),
    getCartItems: executeHandler(getCartItems),
    removeFromCart: executeHandler(removeFromCart)
};