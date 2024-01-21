const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { HttpError } = require('./errorHandler.middleware');
const { asyncHandlerWrapper } = require('./wrapper.middleware');
require('dotenv').config();

/**
 * Middleware for verifying the validity of an access token in the Authorization header.
 * @param {string} [authMode='hard'] - Authentication mode. Use 'hard' to throw an error if the token is not provided, or 'soft' to allow unauthenticated users.
 */
const verifyToken = (authMode = 'hard') => {
    const allowedModes = ['hard', 'soft'];

    if (!allowedModes.includes(authMode)) {
        throw new Error(`Invalid authentication mode '${authMode}'. Allowed modes are ${allowedModes.join(', ')}.`);
    }

    return asyncHandlerWrapper(async (req, res) => {
        // Authorization: Bearer <access-token>
        const authHeader = req.headers.authorization;

        if (!authHeader) {
            if (authMode === 'hard') {
                throw new HttpError(StatusCodes.UNAUTHORIZED, 'Token does not exist in Authorization header.');
            } else if (authMode === 'soft') {
                return;
            }
        }

        const accessToken = authHeader.split(' ')[1];

        const decoded = jwt.verify(accessToken, process.env.PRIVATE_KEY, { ignoreExpiration: false });
        req.decodedToken = decoded;
    });
};

module.exports = verifyToken;