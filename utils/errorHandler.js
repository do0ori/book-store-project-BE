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

    console.error(`>> ${new Date().toLocaleString()}: ${err.stack}`);

    if (err instanceof HttpError) {
        res.status(err.statusCode).json({ message: err.message });
    } else if (err instanceof TokenExpiredError || err instanceof JsonWebTokenError || err instanceof NotBeforeError) {
        res.status(StatusCodes.UNAUTHORIZED).send({ message: err.message });
    } else if (["ER_NO_REFERENCED_ROW", "ER_ROW_IS_REFERENCED", "ER_ROW_IS_REFERENCED_2", "ER_NO_REFERENCED_ROW_2"].includes(err.code)) {
        res.status(StatusCodes.BAD_REQUEST).send({ message: "A foreign key constraint fails. Send a valid input." })
    } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({ message: "Something went wrong!" });
    }
};

module.exports = {
    HttpError,
    errorHandler
};