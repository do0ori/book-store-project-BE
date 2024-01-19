const orderService = require('../services/order.service');
const { StatusCodes } = require('http-status-codes');
const { asyncHandlerWrapper, asyncTransactionWrapper } = require('../middlewares/wrapper.middleware');

const submitOrder = async (req, res) => {
    const userId = req.decodedToken.userId;
    const { items, delivery, totalQuantity, totalPrice, firstBookTitle } = req.body;

    const data = await orderService.submitOrder(req.conn, userId, items, delivery, totalQuantity, totalPrice, firstBookTitle);

    res.status(StatusCodes.CREATED).json(data);
};

const getOrderList = async (req, res) => {
    const userId = req.decodedToken.userId;

    const data = await orderService.getOrderList(req.conn, userId);

    res.status(StatusCodes.OK).json(data);
};

const getOrderDetails = async (req, res) => {
    const { orderId } = req.params;

    const data = await orderService.getOrderDetails(req.conn, orderId);

    res.status(StatusCodes.OK).json(data);
};

module.exports = {
    submitOrder: asyncTransactionWrapper(submitOrder),
    getOrderList: asyncHandlerWrapper(getOrderList),
    getOrderDetails: asyncHandlerWrapper(getOrderDetails)
};