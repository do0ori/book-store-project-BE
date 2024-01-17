const pool = require('../db');
const { HttpError } = require('../middlewares/errorHandler');
const { StatusCodes } = require('http-status-codes');
const { executeHandler } = require('../middlewares/handlerWrapper');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * @param {string} rawPassword
 * @param {string} salt - base64 encoded
 */
const encryptPassword = (rawPassword, salt = null) => {
    if (!salt) {
        salt = crypto.randomBytes(parseInt(process.env.SALT_SIZE)).toString('base64');
    }
    const hashedPassword = crypto.pbkdf2Sync(
        rawPassword, salt, parseInt(process.env.ITERATIONS), parseInt(process.env.KEY_LEN), process.env.DIGEST
    ).toString('base64');
    return { salt, hashedPassword };
};

const signUp = async (req, res) => {
    const { email, password } = req.body;

    const { salt, hashedPassword } = encryptPassword(password);

    const sql = "INSERT INTO users (email, password, salt) VALUES (?, ?, ?)";
    const values = [email, hashedPassword, salt];
    [result] = await pool.query(sql, values);

    res.status(StatusCodes.CREATED).json(result);
};

const logIn = async (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await pool.query(sql, email);

    const loginUser = rows[0];
    const { hashedPassword } = encryptPassword(password, loginUser?.salt);
    if (loginUser && loginUser.password == hashedPassword) {
        // JWT 발행
        const token = jwt.sign({
            uid: loginUser.id,
            email: loginUser.email
        }, process.env.PRIVATE_KEY, {
            expiresIn: process.env.TOKEN_LIFETIME,
            issuer: process.env.ISSUER
        });
        res.cookie("token", token, { httpOnly: true }); // httpOnly: 웹서버에 의해서만(API로만) access 가능하도록 설정

        res.status(StatusCodes.OK).end();
    } else {
        throw new HttpError(StatusCodes.UNAUTHORIZED);
    }
};

const passwordResetRequest = async (req, res) => {
    const { email } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await pool.query(sql, email);

    const user = rows[0];
    if (user) {
        res.status(StatusCodes.OK).json({ email });
    } else {
        throw new HttpError(StatusCodes.UNAUTHORIZED);
    }
};

const resetPassword = async (req, res) => {
    const { email, password } = req.body;

    const { salt, hashedPassword } = encryptPassword(password);

    const sql = "UPDATE users SET password = ?, salt = ? WHERE email = ?";
    const values = [hashedPassword, salt, email];
    const [result] = await pool.query(sql, values);

    if (result.affectedRows) {
        res.status(StatusCodes.OK).json(result);
    } else {
        throw new HttpError(StatusCodes.BAD_REQUEST);
    }
};

module.exports = {
    signUp: executeHandler(signUp),
    logIn: executeHandler(logIn),
    passwordResetRequest: executeHandler(passwordResetRequest),
    resetPassword: executeHandler(resetPassword)
};