const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const { HttpError } = require('../middlewares/errorHandler.middleware');
const { isTokenExist } = require('../utils/existanceCheck.util');
require('dotenv').config();

const getToken = async (conn, userId) => {
    const exists = await isTokenExist(conn, userId);

    if (exists) {
        const sql = "SELECT refresh_token from token WHERE user_id = ?";
        const [rows] = await conn.query(sql, userId);

        return rows[0].refresh_token;
    } else {
        throw new HttpError(StatusCodes.NOT_FOUND, "해당 유저에게 발급된 refresh token이 없습니다.");
    }
};

/**
 * Checks if the provided refreshToken is valid for the given user.
 *
 * @param {string} refreshToken - The refresh token sent by the client.
 * @param {string} userId - The user ID for whom the refresh token is being checked.
 * @returns {boolean} - True if the refresh token is valid; otherwise, false.
 */
const isValidRefreshToken = async (conn, refreshToken, userId) => {
    try {
        const storedRefreshToken = await getToken(conn, userId);

        if (refreshToken !== storedRefreshToken) {
            return false;
        }

        jwt.verify(storedRefreshToken, process.env.PRIVATE_KEY, { ignoreExpiration: false });

        return true;
    } catch (error) {
        return false;
    }
};

const updateToken = async (conn, userId, refreshToken) => {
    const exists = await isTokenExist(conn, userId);
    
    if (!exists) {
        const sql = "INSERT INTO token (user_id, refresh_token) VALUES (?, ?)";
        const values = [userId, refreshToken];
        const [result] = await conn.query(sql, values);

        return result;
    } else {
        const sql = "UPDATE token SET refresh_token = ? WHERE user_id = ?";
        const values = [refreshToken, userId];
        const [result] = await conn.query(sql, values);

        if (result.affectedRows) {
            return result;
        } else {
            throw new HttpError(StatusCodes.BAD_REQUEST);
        }
    }
};

const removeToken = async (conn, userId) => {
    const exists = await isTokenExist(conn, userId);

    if (exists) {
        const sql = "DELETE FROM token WHERE user_id = ?";
        const [result] = await conn.query(sql, userId);

        if (result.affectedRows) {
            return result;
        } else {
            throw new HttpError(StatusCodes.BAD_REQUEST);
        }
    } else {
        throw new HttpError(StatusCodes.CONFLICT, "이미 처리된 요청입니다.");
    }
};

module.exports = {
    isValidRefreshToken,
    updateToken,
    removeToken
};