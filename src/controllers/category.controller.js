const categoryService = require('../services/category.service');
const { StatusCodes } = require('http-status-codes');
const { asyncHandlerWrapper } = require('../middlewares/wrapper.middleware');

const getAllCategory = async (req, res) => {
    const data = await categoryService.getAllCategory(req.conn);

    res.status(StatusCodes.OK).json(data);
};

module.exports = {
    getAllCategory: asyncHandlerWrapper(getAllCategory)
};