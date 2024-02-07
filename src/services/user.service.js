const { StatusCodes } = require('http-status-codes');
const { HttpError } = require('../middlewares/errorHandler.middleware');
const { encryptPassword, issueToken } = require('../utils/authentication.util');
const tokenService = require('./token.service');

/**
 * Checks whether a user record exists for a given email address.
 * @param {Object} conn - The database connection object.
 * @param {string} email - The email address of the user.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the user record exists (true) or not (false).
 */
const isUserExist = async (conn, email) => {
    const sql = "SELECT EXISTS (SELECT 1 FROM users WHERE email = ?) AS exist";
    const [result] = await conn.query(sql, email);

    return result[0].exist === 1;
};

const signUp = async (conn, email, hashedPassword, salt) => {
    const exists = await isUserExist(conn, email);

    if (!exists) {
        const sql = "INSERT INTO users (email, password, salt) VALUES (?, ?, ?)";
        const values = [email, hashedPassword, salt];
        const [result] = await conn.query(sql, values);

        return result;
    } else {
        throw new HttpError(StatusCodes.CONFLICT, `${email}은 이미 가입된 계정입니다.`)
    }
};

const logIn = async (conn, email, password) => {
    let sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await conn.query(sql, email);

    const loginUser = rows[0];
    const { hashedPassword } = encryptPassword(password, loginUser?.salt);

    if (loginUser && loginUser.password === hashedPassword) {
        const accessToken = issueToken(loginUser.id, 'access');
        const refreshToken = issueToken(loginUser.id, 'refresh');

        await tokenService.updateToken(conn, loginUser.id, refreshToken);

        return { accessToken, refreshToken };
    } else {
        throw new HttpError(StatusCodes.UNAUTHORIZED);
    }
};

const passwordResetRequest = async (conn, email) => {
    const exists = await isUserExist(conn, email);

    if (exists) {
        return { email };
    } else {
        throw new HttpError(StatusCodes.UNAUTHORIZED);
    }
};

const resetPassword = async (conn, email, salt, hashedPassword) => {
    const sql = "UPDATE users SET password = ?, salt = ? WHERE email = ?";
    const values = [hashedPassword, salt, email];
    const [result] = await conn.query(sql, values);

    if (result.affectedRows) {
        return result;
    } else {
        throw new HttpError(StatusCodes.BAD_REQUEST);
    }
};

const logOut = async (conn, userId) => {
    return await tokenService.removeToken(conn, userId);
};

module.exports = {
    isUserExist,
    signUp,
    logIn,
    passwordResetRequest,
    resetPassword,
    logOut
};