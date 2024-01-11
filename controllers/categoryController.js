const { HttpError } = require('../utils/errorHandler');
const { StatusCodes } = require('http-status-codes');

const getAllCategory = async (req, res, next) => {
    try {
        const sql = "SELECT * FROM category";
        const [rows] = await req.connection.query(sql);

        res.status(StatusCodes.OK).json(rows);
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllCategory
};