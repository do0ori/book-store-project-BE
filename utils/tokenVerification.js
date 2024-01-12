const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { HttpError } = require('./errorHandler');
require('dotenv').config();

/**
 * @param {string} [authMode='hard'] - Authentication mode. Use 'hard' to throw an error if the token is not provided, or 'soft' to allow unauthenticated users.
 */
const verifyToken = (authMode = 'hard') => {
    const allowedModes = ['hard', 'soft'];

    if (!allowedModes.includes(authMode)) {
        throw new Error(`Invalid authentication mode '${authMode}'. Allowed modes are ${allowedModes.join(', ')}.`);
    }

    return (req, res, next) => {
        try {
            // Authorization: Bearer <token>
            const AuthHeader = req.headers.authorization;

            if (!AuthHeader) {
                if (authMode === 'hard') {
                    throw new HttpError(StatusCodes.UNAUTHORIZED, 'Token does not exist in Authorization header.');
                } else if (authMode === 'soft') {
                    next();
                    return;
                }
            }

            const token = AuthHeader.split(' ')[1];

            const decoded = jwt.verify(token, process.env.PRIVATE_KEY, { ignoreExpiration: false });
            req.decodedToken = decoded;
            next();
        } catch (error) {
            next(error);
        }
    };
};

module.exports = verifyToken;