const express = require('express');
const router = express.Router();

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

router.route('/')
    .post(addToCart)
    .get(getCart);

router.delete('/:bookId', removeFromCart);  // bookId가 아니라 cart의 itemId가 될 수도
router.post('/items', getSelectedItemsFromCart);    // uri 미확정. 일단 임시로.

module.exports = router;