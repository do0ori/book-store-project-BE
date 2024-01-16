const executeHandler = (handler) => async (req, res, next) => {
    try {
        await handler(req, res);
        next();
    } catch (error) {
        next(error);
    }
}

const transactionExecuteHandler = (handler) => async (req, res, next) => {
    try {
        await req.connection.beginTransaction();
        await handler(req, res);
        await req.connection.commit();
        next();
    } catch (error) {
        await req.connection.rollback();
        next(error);
    }
}

module.exports = {
    executeHandler,
    transactionExecuteHandler
};