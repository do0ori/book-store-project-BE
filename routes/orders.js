const express = require('express');
const router = express.Router();

const submitOrder = (req, res) => {
    res.json("결제(주문)하기");
};

const getOrderList = (req, res) => {
    res.json("주문 목록(내역) 조회");
};

const getOrderDetails = (req, res) => {
    res.json("주문 상세 상품 조회");
};

router.route('/')
    .post(submitOrder)
    .get(getOrderList);

router.get('/:orderId', getOrderDetails);

module.exports = router;