const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/tokenVerification');
const validator = require('../middlewares/validation');
const {
    submitOrder,
    getOrderList,
    getOrderDetails
} = require('../controllers/orderController');

router.use(verifyToken(authMode = 'hard'));
router.post('/', validator.submitOrder, submitOrder);
router.get('/', getOrderList);
router.get('/:orderId', validator.getOrderDetails, getOrderDetails);

module.exports = router;