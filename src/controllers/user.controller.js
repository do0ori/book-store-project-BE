const userService = require('../services/user.service');
const { StatusCodes } = require('http-status-codes');
const { asyncHandlerWrapper } = require('../middlewares/wrapper.middleware');
const { encryptPassword } = require('../utils/authentication.util');

const signUp = async (req, res) => {
    const { email, password } = req.body;
    const { salt, hashedPassword } = encryptPassword(password);

    const data = await userService.signUp(req.conn, email, hashedPassword, salt);

    res.status(StatusCodes.CREATED).json(data);
};

const logIn = async (req, res) => {
    const { email, password } = req.body;

    const { accessToken, refreshToken } = await userService.logIn(req.conn, email, password);

    res.cookie('refreshToken', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict' });
    res.status(StatusCodes.OK).json({ accessToken });
};

const passwordResetRequest = async (req, res) => {
    const { email } = req.body;

    const data = await userService.passwordResetRequest(req.conn, email);

    res.status(StatusCodes.OK).json(data);
};

const resetPassword = async (req, res) => {
    const { email, password } = req.body;
    const { salt, hashedPassword } = encryptPassword(password);

    const data = await userService.resetPassword(req.conn, email, salt, hashedPassword);

    res.status(StatusCodes.OK).json(data);
};

const logOut = async (req, res) => {
    const userId = req.decodedToken.userId;

    const data = await userService.logOut(req.conn, userId);

    res.clearCookie('refreshToken');
    res.status(StatusCodes.OK).json(data);
};

module.exports = {
    signUp: asyncHandlerWrapper(signUp),
    logIn: asyncHandlerWrapper(logIn),
    passwordResetRequest: asyncHandlerWrapper(passwordResetRequest),
    resetPassword: asyncHandlerWrapper(resetPassword),
    logOut: asyncHandlerWrapper(logOut)
};