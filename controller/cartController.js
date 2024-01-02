const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const addToCart = (req, res) => {
    res.json("장바구니 담기");
};

const getCart = (req, res) => {
    res.json("장바구니 조회");
};

const removeFromCart = (req, res) => {
    res.json("장바구니 삭제");
};

const getSelectedItemsFromCart = (req, res) => {
    res.json("장바구니에서 선택한 '주문 예상' 상품 목록 조회");
};

module.exports = {
    addToCart,
    getCart,
    removeFromCart,
    getSelectedItemsFromCart
};