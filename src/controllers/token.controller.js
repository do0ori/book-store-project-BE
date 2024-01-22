const tokenService = require('../services/token.service');
const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { HttpError } = require('../middlewares/errorHandler.middleware');
const { issueToken } = require('../utils/authentication.util');
const { asyncHandlerWrapper } = require('../middlewares/wrapper.middleware');

const refreshToken = async (req, res) => {
    const accessToken = req.headers.authorization.split(' ')[1];
    const refreshToken = req.cookies.refreshToken;

    try {
        jwt.verify(accessToken, process.env.PRIVATE_KEY, { ignoreExpiration: false });
        
        throw new HttpError(StatusCodes.BAD_REQUEST, 'Access token is not expired.');
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            const userId = jwt.verify(refreshToken, process.env.PRIVATE_KEY, { ignoreExpiration: true }).userId;

            const isValid = await tokenService.isValidRefreshToken(req.conn, refreshToken, userId);

            if (!isValid) {
                throw new HttpError(StatusCodes.UNAUTHORIZED, "세션이 만료되었습니다. 다시 로그인해주세요.");
            }

            const newAccessToken = issueToken(userId, 'access');

            res.status(StatusCodes.OK).json({ accessToken: newAccessToken });
        } else {
            throw error;
        }
    }
};

module.exports = {
    refreshToken: asyncHandlerWrapper(refreshToken)
};