const { HttpError } = require('../middlewares/errorHandler');
const { StatusCodes } = require('http-status-codes');
const { executeHandler } = require('../middlewares/handlerWrapper');

const getAllCategory = async (req, res) => {
    const sql = "SELECT * FROM category";
    const [rows] = await req.connection.query(sql);

    res.status(StatusCodes.OK).json(rows);
};

module.exports = {
    getAllCategory: executeHandler(getAllCategory)
};