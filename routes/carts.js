const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/tokenVerification');
const validator = require('../middlewares/validation');
const {
    addToCart,
    getCartItems,
    removeFromCart
} = require('../controllers/cartController');

router.use(verifyToken(authMode = 'hard'));
router.post('/', validator.addToCart, addToCart);
router.get('/', validator.getCartItems, getCartItems);
router.delete('/:itemId', validator.removeFromCart, removeFromCart);

module.exports = router;