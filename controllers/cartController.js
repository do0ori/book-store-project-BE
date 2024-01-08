const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const addToCart = (req, res) => {
    const { userId, bookId, quantity } = req.body;

    const sql = "INSERT INTO cart (user_id, book_id, quantity) VALUES (?, ?, ?)";
    const values = [userId, bookId, quantity];
    conn.query(
        sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.CREATED).json(results);
        }
    );
};

const getCartItems = (req, res) => {
    const { userId, selected } = req.body;

    let sql = `
        SELECT
            item_id,
            id AS book_id,
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
    conn.query(
        sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.OK).json(results);
        }
    )
};

const removeFromCart = (req, res) => {
    const { itemId } = req.params;

    const sql = "DELETE FROM cart WHERE item_id = ?";
    conn.query(
        sql, itemId,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if (results.affectedRows == 0) {
                return res.status(StatusCodes.BAD_REQUEST).end();
            } else {
                return res.status(StatusCodes.OK).json(results);
            }
        }
    );
};

module.exports = {
    addToCart,
    getCartItems,
    removeFromCart
};