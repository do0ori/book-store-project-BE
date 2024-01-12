const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/tokenVerification');
const {
    addToCart,
    getCartItems,
    removeFromCart
} = require('../controllers/cartController');

router.use(verifyToken(authMode = 'hard'));
router.post('/', addToCart);
router.get('/', getCartItems);
router.delete('/:itemId', removeFromCart);

module.exports = router;