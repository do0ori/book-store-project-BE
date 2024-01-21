const { StatusCodes } = require('http-status-codes');
const { HttpError } = require('../middlewares/errorHandler.middleware');
const { isTokenExist } = require('../utils/existanceCheck.util');

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

module.exports = {
    updateToken,
    removeToken,
    getToken
};