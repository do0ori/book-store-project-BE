const { StatusCodes } = require('http-status-codes');

class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = "CustomError";
        this.statusCode = statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    }
}

class NotFoundError extends CustomError {
    constructor(message) {
        super(message || "Not Found");
        this.name = "NotFoundError";
        this.statusCode = StatusCodes.NOT_FOUND;
    }
}

const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomError) {
        res.status(err.statusCode).json({ error: err.message });
    } else {
        console.error(err.stack);
        if (req.connection) {
            req.connection.release();
        }
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Something went wrong!");
    }
};

module.exports = {
    errorHandler
};