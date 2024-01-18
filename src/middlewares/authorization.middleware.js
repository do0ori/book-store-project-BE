const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { HttpError } = require('./errorHandler.middleware');
const { asyncHandlerWrapper } = require('./wrapper.middleware');
require('dotenv').config();

/**
 * @param {string} [authMode='hard'] - Authentication mode. Use 'hard' to throw an error if the token is not provided, or 'soft' to allow unauthenticated users.
 */
const verifyToken = (authMode = 'hard') => {
    const allowedModes = ['hard', 'soft'];

    if (!allowedModes.includes(authMode)) {
        throw new Error(`Invalid authentication mode '${authMode}'. Allowed modes are ${allowedModes.join(', ')}.`);
    }

    return asyncHandlerWrapper(async (req, res) => {
        // Authorization: Bearer <token>
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            if (authMode === 'hard') {
                throw new HttpError(StatusCodes.UNAUTHORIZED, 'Token does not exist in Authorization header.');
            } else if (authMode === 'soft') {
                return;
            }
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token, process.env.PRIVATE_KEY, { ignoreExpiration: false });
        req.decodedToken = decoded;
    });
};

module.exports = verifyToken;