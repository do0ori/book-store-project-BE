const { StatusCodes } = require('http-status-codes');
const { HttpError } = require('../middlewares/errorHandler.middleware');

const addToCart = async (conn, userId, bookId, quantity) => {
    const sql = "INSERT INTO cart (user_id, book_id, quantity) VALUES (?, ?, ?)";
    const values = [userId, bookId, quantity];
    const [result] = await conn.query(sql, values);

    return result;
};

const getCartItems = async (conn, userId, selected) => {
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
    const values = [userId];

    if (selected) {
        sql += "AND item_id IN (?)";
        values.push(selected);
    }

    let [rows] = await conn.query(sql, values);

    return rows;
};

const removeFromCart = async (conn, itemId) => {
    const sql = "DELETE FROM cart WHERE item_id = ?";
    const [result] = await conn.query(sql, itemId);

    if (result.affectedRows) {
        return result;
    } else {
        throw new HttpError(StatusCodes.BAD_REQUEST);
    }
};

module.exports = {
    addToCart,
    getCartItems,
    removeFromCart
};