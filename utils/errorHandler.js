const { StatusCodes, getReasonPhrase } = require('http-status-codes');
const { TokenExpiredError, JsonWebTokenError, NotBeforeError } = require('jsonwebtoken');

class HttpError extends Error {
    constructor(statusCode, message) {
        super(message || getReasonPhrase(statusCode));
        this.name = "HttpError";
        this.statusCode = statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    }
}

const errorHandler = (err, req, res, next) => {
    if (req.connection) {
        req.connection.release();
    }
    if (err instanceof HttpError) {
        res.status(err.statusCode).json({ message: err.message });
    } else if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError || err instanceof NotBeforeError) {
        res.status(StatusCodes.UNAUTHORIZED).send({ message: err.message });
    } else {
        console.error(`>> ${new Date().toLocaleString()}\n${err.stack}`);
        res.status(StatusCodes.BAD_REQUEST).send({ message: "Something went wrong!" });
    }
};

module.exports = {
    HttpError,
    errorHandler
};