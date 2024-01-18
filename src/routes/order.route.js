const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authorization.middleware');
const validator = require('../middlewares/validation.middleware');
const orderController = require('../controllers/order.controller');

router.use(verifyToken(authMode = 'hard'));
router.post('/', validator.submitOrder, orderController.submitOrder);
router.get('/', orderController.getOrderList);
router.get('/:orderId', validator.getOrderDetails, orderController.getOrderDetails);

module.exports = router;