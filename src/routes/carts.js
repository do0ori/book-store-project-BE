const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authorization.middleware');
const validator = require('../middlewares/validation.middleware');
const {
    addToCart,
    getCartItems,
    removeFromCart
} = require('../controllers/cart.controller');

router.use(verifyToken(authMode = 'hard'));
router.post('/', validator.addToCart, addToCart);
router.get('/', validator.getCartItems, getCartItems);
router.delete('/:itemId', validator.removeFromCart, removeFromCart);

module.exports = router;