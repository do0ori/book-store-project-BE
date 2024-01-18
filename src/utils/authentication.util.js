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

const issueToken = (loginUser) => {
    const payload = {
        userId: loginUser.id
    };

    const options = {
        expiresIn: process.env.TOKEN_LIFETIME,
        issuer: process.env.ISSUER
    };

    const token = jwt.sign(payload, process.env.PRIVATE_KEY, options);

    return token;
};

module.exports = {
    encryptPassword,
    issueToken
};