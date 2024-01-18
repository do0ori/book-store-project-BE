const { StatusCodes } = require('http-status-codes');
const { HttpError } = require('../middlewares/errorHandler.middleware');
const { encryptPassword, issueToken } = require('../utils/authentication.util');

const signUp = async (conn, email, hashedPassword, salt) => {
    const sql = "INSERT INTO users (email, password, salt) VALUES (?, ?, ?)";
    const values = [email, hashedPassword, salt];
    [result] = await conn.query(sql, values);

    return result;
};

const logIn = async (conn, email, password) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await conn.query(sql, email);

    const loginUser = rows[0];
    const { hashedPassword } = encryptPassword(password, loginUser?.salt);

    if (loginUser && loginUser.password === hashedPassword) {
        return issueToken(loginUser);
    } else {
        throw new HttpError(StatusCodes.UNAUTHORIZED);
    }
};

const passwordResetRequest = async (conn, email) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    const [rows] = await conn.query(sql, email);

    const user = rows[0];

    if (user) {
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

module.exports = {
    signUp,
    logIn,
    passwordResetRequest,
    resetPassword
};