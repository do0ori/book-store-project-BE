const express = require('express');
const router = express.Router();
const {
    addToCart,
    getCart,
    removeFromCart,
    getSelectedItemsFromCart
} = require('../controller/cartController');

router.post('/', addToCart);
router.get('/', getCart);
router.delete('/:bookId', removeFromCart);  // bookId가 아니라 cart의 itemId가 될 수도
router.post('/items', getSelectedItemsFromCart);    // uri 미확정. 일단 임시로.

module.exports = router;