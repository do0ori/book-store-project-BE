const pool = require('./db');

const getConnection = async (req, res, next) => {
    try {
        req.connection = await pool.getConnection();
        next();
    } catch (error) {
        next(error);
    }
};

const releaseConnection = (req, res, next) => {
    if (req.connection) {
        req.connection.release();
    }
    next();
};

module.exports = {
    getConnection,
    releaseConnection,
};
