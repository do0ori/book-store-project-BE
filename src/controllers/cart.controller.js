const cartService = require('../services/cart.service');
const { StatusCodes } = require('http-status-codes');
const { asyncHandlerWrapper } = require('../middlewares/wrapper.middleware');

const addToCart = async (req, res) => {
    const userId = req.decodedToken.userId;
    const { bookId, quantity } = req.body;

    const data = await cartService.addToCart(req.conn, userId, bookId, quantity);

    res.status(StatusCodes.CREATED).json(data);
};

const getCartItems = async (req, res) => {
    const userId = req.decodedToken.userId;
    const { selected } = req.body;

    const data = await cartService.getCartItems(req.conn, userId, selected);

    res.status(StatusCodes.OK).json(data);
};

const removeFromCart = async (req, res) => {
    const { itemId } = req.params;

    const data = await cartService.removeFromCart(req.conn, itemId);

    res.status(StatusCodes.OK).json(data);
};

module.exports = {
    addToCart: asyncHandlerWrapper(addToCart),
    getCartItems: asyncHandlerWrapper(getCartItems),
    removeFromCart: asyncHandlerWrapper(removeFromCart)
};