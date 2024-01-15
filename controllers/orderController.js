const { HttpError } = require('../utils/errorHandler');
const { StatusCodes } = require('http-status-codes');

// 나중에 transaction으로
const submitOrder = async (req, res, next) => {
    try {
        const { items, delivery, totalQuantity, totalPrice, firstBookTitle } = req.body;

        let sql = "INSERT INTO delivery (address, recipient, contact) VALUES (?, ?, ?)";
        let values = [delivery.address, delivery.recipient, delivery.contact];
        let [result] = await req.connection.query(sql, values);

        const delivery_id = result.insertId;

        sql = "INSERT INTO orders (user_id, delivery_id, book_title, total_quantity, total_price) VALUES (?, ?, ?, ?, ?)";
        values = [req.decodedToken.uid, delivery_id, firstBookTitle, totalQuantity, totalPrice];
        [result] = await req.connection.query(sql, values);

        const order_id = result.insertId;

        sql = "INSERT INTO ordered_book (order_id, book_id, quantity) VALUES ?";
        values = [];
        items.forEach((item) => values.push([order_id, item.bookId, item.quantity]));
        [result] = await req.connection.query(sql, [values]);

        sql = "DELETE FROM cart WHERE item_id IN (?)";
        values = [items.map(item => item.cartItemId)];
        [result] = await req.connection.query(sql, values);

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

const getOrderList = async (req, res, next) => {
    try {
        const sql = `
            SELECT
                orders.id AS orderId,
                ordered_at AS orderedAt,
                address,
                recipient,
                contact,
                book_title AS bookTitle,
                total_quantity AS totalQuantity,
                total_price AS totalPrice
            FROM orders
            LEFT JOIN delivery
            ON orders.delivery_id = delivery.id
            WHERE user_id = ?
        `;
        const [rows] = await req.connection.query(sql, req.decodedToken.uid);

        res.status(StatusCodes.OK).json(rows);
        next();
    } catch (error) {
        next(error);
    }
};

const getOrderDetails = async (req, res, next) => {
    try {
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
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    submitOrder,
    getOrderList,
    getOrderDetails
};