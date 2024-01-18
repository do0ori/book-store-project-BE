const likeService = require('../services/like.service');
const { StatusCodes } = require('http-status-codes');
const { asyncHandlerWrapper } = require('../middlewares/wrapper.middleware');

const addToLikes = async (req, res) => {
    const userId = req.decodedToken.userId;
    const { bookId } = req.params;

    const data = await likeService.addToLikes(req.conn, userId, bookId);

    res.status(StatusCodes.CREATED).json(data);
};

const removeFromLikes = async (req, res) => {
    const userId = req.decodedToken.userId;
    const { bookId } = req.params;

    const data = await likeService.removeFromLikes(req.conn, userId, bookId);

    res.status(StatusCodes.OK).json(data);
};

module.exports = {
    addToLikes: asyncHandlerWrapper(addToLikes),
    removeFromLikes: asyncHandlerWrapper(removeFromLikes)
};