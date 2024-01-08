const express = require('express');
const router = express.Router();
const {
    addToCart,
    getCartItems,
    removeFromCart
} = require('../controllers/cartController');

router.post('/', addToCart);
router.get('/', getCartItems);
router.delete('/:itemId', removeFromCart);

module.exports = router;