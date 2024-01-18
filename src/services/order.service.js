const { StatusCodes } = require('http-status-codes');
const { HttpError } = require('../middlewares/errorHandler.middleware');
const convertSnakeToCamel = require('../utils/responseFormatter.util');

const submitOrder = async (conn, userId, items, delivery, totalQuantity, totalPrice, firstBookTitle) => {
    let sql = "INSERT INTO delivery (address, recipient, contact) VALUES (?, ?, ?)";
    let values = [delivery.address, delivery.recipient, delivery.contact];
    let [result] = await conn.query(sql, values);

    const deliveryId = result.insertId;

    sql = "INSERT INTO orders (user_id, delivery_id, book_title, total_quantity, total_price) VALUES (?, ?, ?, ?, ?)";
    values = [userId, deliveryId, firstBookTitle, totalQuantity, totalPrice];
    [result] = await conn.query(sql, values);

    const orderId = result.insertId;

    sql = "INSERT INTO ordered_book (order_id, book_id, quantity) VALUES ?";
    values = [];
    items.forEach((item) => values.push([orderId, item.bookId, item.quantity]));
    [result] = await conn.query(sql, [values]);

    sql = "DELETE FROM cart WHERE item_id IN (?)";
    values = [items.map(item => item.cartItemId)];
    [result] = await conn.query(sql, values);

    if (result.affectedRows === items.length) {
        return result;
    } else {
        throw new HttpError(StatusCodes.BAD_REQUEST, "DB transaction fails. Send valid inputs.");
    }
};

const getOrderList = async (conn, userId) => {
    const sql = `
        SELECT
            orders.id AS orderId,
            ordered_at,
            address,
            recipient,
            contact,
            book_title,
            total_quantity,
            total_price
        FROM orders
        LEFT JOIN delivery
        ON orders.delivery_id = delivery.id
        WHERE user_id = ?
    `;
    const [rows] = await conn.query(sql, userId);

    return convertSnakeToCamel(rows);
};

const getOrderDetails = async (conn, orderId) => {
    const sql = `
        SELECT
            book_id AS bookId,
            title,
            author,
            price,
            quantity
        FROM ordered_book
        LEFT JOIN books
        ON ordered_book.book_id = books.id
        WHERE order_id = ?
    `;
    const [rows] = await conn.query(sql, orderId);

    if (rows.length) {
        return rows;
    } else {
        throw new HttpError(StatusCodes.NOT_FOUND, "존재하지 않는 주문입니다.");
    }
};

module.exports = {
    submitOrder,
    getOrderList,
    getOrderDetails
};