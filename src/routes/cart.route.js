const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authorization.middleware');
const validator = require('../middlewares/validation.middleware');
const cartController = require('../controllers/cart.controller');

router.use(verifyToken(authMode = 'hard'));
router.post('/', validator.addToCart, cartController.addToCart);
router.get('/', validator.getCartItems, cartController.getCartItems);
router.delete('/:itemId', validator.removeFromCart, cartController.removeFromCart);

module.exports = router;