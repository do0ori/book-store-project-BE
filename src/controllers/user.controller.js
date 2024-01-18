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

    const token = await userService.logIn(req.conn, email, password);

    res.cookie("token", token, { httpOnly: true });
    res.status(StatusCodes.OK).end();
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

module.exports = {
    signUp: asyncHandlerWrapper(signUp),
    logIn: asyncHandlerWrapper(logIn),
    passwordResetRequest: asyncHandlerWrapper(passwordResetRequest),
    resetPassword: asyncHandlerWrapper(resetPassword)
};