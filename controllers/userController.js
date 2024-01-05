const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
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

const signUp = (req, res) => {
    const { email, password } = req.body;

    const { salt, hashedPassword } = encryptPassword(password);

    const sql = "INSERT INTO users (email, password, salt) VALUES (?, ?, ?)";
    const values = [email, hashedPassword, salt];
    conn.query(
        sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            return res.status(StatusCodes.CREATED).json(results);
        }
    );
};

const logIn = (req, res) => {
    const { email, password } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    conn.query(
        sql, email,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            const loginUser = results[0];
            const { hashedPassword } = encryptPassword(password, loginUser.salt);
            if (loginUser && loginUser.password == hashedPassword) {
                // JWT 발행
                const token = jwt.sign({
                    id: loginUser.id,
                    email: loginUser.email
                }, process.env.PRIVATE_KEY, {
                    expiresIn: '5m',
                    issuer: "do0ori"
                });
                res.cookie("token", token, { httpOnly: true }); // httpOnly: 웹서버에 의해서만(API로만) access 가능하도록 설정
                console.log(token);

                return res.status(StatusCodes.OK).json(results);
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }
        }
    );
};

const passwordResetRequest = (req, res) => {
    const { email } = req.body;

    const sql = "SELECT * FROM users WHERE email = ?";
    conn.query(
        sql, email,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            const user = results[0];
            if (user) {
                return res.status(StatusCodes.OK).json({ email });
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }
        }
    )
};

const resetPassword = (req, res) => {
    const { email, password } = req.body;

    const { salt, hashedPassword } = encryptPassword(password);

    const sql = "UPDATE users SET password = ?, salt = ? WHERE email = ?";
    const values = [hashedPassword, salt, email];
    conn.query(
        sql, values,
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if (results.affectedRows == 0) {
                return res.status(StatusCodes.BAD_REQUEST).end();
            } else {
                return res.status(StatusCodes.OK).json(results);
            }
        }
    )
};

module.exports = {
    signUp,
    logIn,
    passwordResetRequest,
    resetPassword
};