const executeHandler = (handler) => async (req, res, next) => {
    try {
        await handler(req, res);
        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    executeHandler
};