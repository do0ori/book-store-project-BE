const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authorization.middleware');
const validator = require('../middlewares/validation.middleware');
const {
    submitOrder,
    getOrderList,
    getOrderDetails
} = require('../controllers/order.controller');

router.use(verifyToken(authMode = 'hard'));
router.post('/', validator.submitOrder, submitOrder);
router.get('/', getOrderList);
router.get('/:orderId', validator.getOrderDetails, getOrderDetails);

module.exports = router;