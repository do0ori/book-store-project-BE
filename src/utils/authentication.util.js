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
        rawPassword,
        salt,
        parseInt(process.env.ITERATIONS),
        parseInt(process.env.KEY_LEN),
        process.env.DIGEST
    ).toString('base64');

    return { salt, hashedPassword };
};

/**
 * Generates a JSON Web Token (JWT) for the specified user and token type.
 *
 * @param {number} userId - The user ID.
 * @param {string} [tokenType='access'] - The type of token to be generated ('access' or 'refresh').
 * @returns {string} - The generated JWT.
 *
 * @throws {Error} Will throw an error if there is an issue with JWT signing.
 *
 * @example
 * const accessToken = issueToken(userId, 'access');
 * const refreshToken = issueToken(userId, 'refresh');
 */
const issueToken = (userId, tokenType = 'access') => {
    const tokenLifeTime = {
        access: process.env.ACCESS_TOKEN_LIFETIME,
        refresh: process.env.REFRESH_TOKEN_LIFETIME
    };

    const payload = {
        userId
    };

    const options = {
        expiresIn: tokenLifeTime[tokenType],
        issuer: process.env.ISSUER
    };

    const token = jwt.sign(payload, process.env.PRIVATE_KEY, options);

    return token;
};

module.exports = {
    encryptPassword,
    issueToken
};