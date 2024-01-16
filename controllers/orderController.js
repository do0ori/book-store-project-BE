const { HttpError } = require('../middlewares/errorHandler');
const { StatusCodes } = require('http-status-codes');
const { executeHandler, transactionExecuteHandler } = require('../middlewares/handlerWrapper');
const convertSnakeToCamel = require('../utils/responseFormatter');

const submitOrder = async (req, res) => {
    const { items, delivery, totalQuantity, totalPrice, firstBookTitle } = req.body;

    let sql = "INSERT INTO delivery (address, recipient, contact) VALUES (?, ?, ?)";
    let values = [delivery.address, delivery.recipient, delivery.contact];
    let [result] = await req.connection.query(sql, values);

    const deliveryId = result.insertId;

    sql = "INSERT INTO orders (user_id, delivery_id, book_title, total_quantity, total_price) VALUES (?, ?, ?, ?, ?)";
    values = [req.decodedToken.uid, deliveryId, firstBookTitle, totalQuantity, totalPrice];
    [result] = await req.connection.query(sql, values);

    const orderId = result.insertId;

    sql = "INSERT INTO ordered_book (order_id, book_id, quantity) VALUES ?";
    values = [];
    items.forEach((item) => values.push([orderId, item.bookId, item.quantity]));
    [result] = await req.connection.query(sql, [values]);

    sql = "DELETE FROM cart WHERE item_id IN (?)";
    values = [items.map(item => item.cartItemId)];
    [result] = await req.connection.query(sql, values);

    if (result.affectedRows) {
        res.status(StatusCodes.OK).json(result);
    } else {
        throw new HttpError(StatusCodes.BAD_REQUEST);
    }
};

const getOrderList = async (req, res) => {
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
    const [rows] = await req.connection.query(sql, req.decodedToken.uid);

    res.status(StatusCodes.OK).json(convertSnakeToCamel(rows));
};

const getOrderDetails = async (req, res) => {
    const { orderId } = req.params;

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
    const [rows] = await req.connection.query(sql, orderId);

    if (rows.length) {
        res.status(StatusCodes.OK).json(rows);
    } else {
        throw new HttpError(StatusCodes.NOT_FOUND, "존재하지 않는 주문입니다.");
    }
};

module.exports = {
    submitOrder: transactionExecuteHandler(submitOrder),
    getOrderList: executeHandler(getOrderList),
    getOrderDetails: executeHandler(getOrderDetails)
};