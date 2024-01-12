const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/tokenVerification');
const {
    submitOrder,
    getOrderList,
    getOrderDetails
} = require('../controllers/orderController');

router.use(verifyToken(authMode = 'hard'));
router.post('/', submitOrder);
router.get('/', getOrderList);
router.get('/:orderId', getOrderDetails);

module.exports = router;