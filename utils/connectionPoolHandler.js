const pool = require('../db');
const { executeHandler } = require('../utils/handlerWrapper');

const getConnection = async (req, res) => {
    req.connection = await pool.getConnection();
};

const releaseConnection = async (req, res) => {
    await req.connection.release();
};

module.exports = {
    getConnection: executeHandler(getConnection),
    releaseConnection: executeHandler(releaseConnection),
};
