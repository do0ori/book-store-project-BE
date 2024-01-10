const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

// 나중에 transaction으로
const submitOrder = (req, res) => {
    const { userId, items, delivery, totalQuantity, totalPrice, firstBookTitle } = req.body;

    let sql = "INSERT INTO delivery (address, recipient, contact) VALUES (?, ?, ?)";
    let values = [delivery.address, delivery.recipient, delivery.contact];
    conn.query(
        sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            const delivery_id = results.insertId;

            sql = "INSERT INTO orders (user_id, delivery_id, book_title, total_quantity, total_price) VALUES (?, ?, ?, ?, ?)";
            values = [userId, delivery_id, firstBookTitle, totalQuantity, totalPrice];
            conn.query(
                sql, values,
                (err, results) => {
                    if (err) {
                        console.log(err);
                        return res.status(StatusCodes.BAD_REQUEST).end();
                    }
        
                    const order_id = results.insertId;

                    sql = "INSERT INTO ordered_book (order_id, book_id, quantity) VALUES ?";
                    values = [];
                    items.forEach((item) => values.push([order_id, item.bookId, item.quantity]));
                    conn.query(
                        sql, [values],
                        (err, results) => {
                            if (err) {
                                console.log(err);
                                return res.status(StatusCodes.BAD_REQUEST).end();
                            }
                
                            return res.status(StatusCodes.CREATED).json(results);
                        }
                    );
                }
            );
        }
    );
};

const getOrderList = (req, res) => {
    res.json("주문 목록(내역) 조회");
};

const getOrderDetails = (req, res) => {
    res.json("주문 상세 상품 조회");
};

module.exports = {
    submitOrder,
    getOrderList,
    getOrderDetails
};