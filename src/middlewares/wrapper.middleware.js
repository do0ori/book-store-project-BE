const pool = require('../database/pool');

const asyncHandlerWrapper = (handler) => async (req, res, next) => {
    try {
        req.conn = await pool.getConnection();
        await handler(req, res);
        next();
    } catch (error) {
        next(error);
    } finally {
        req.conn.release();
    }
}

const asyncTransactionWrapper = (handler) => async (req, res, next) => {
    try {
        req.conn = await pool.getConnection();
        await req.conn.beginTransaction();
        await handler(req, res);
        await req.conn.commit();
        next();
    } catch (error) {
        await req.conn.rollback();
        next(error);
    } finally {
        req.conn.release();
    }
}

module.exports = {
    asyncHandlerWrapper,
    asyncTransactionWrapper
};