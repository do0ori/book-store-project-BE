const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const addToLikes = (req, res) => {
    const sql = "INSERT INTO likes (user_id, book_id) VALUES (?, ?)";
    const values = [req.body.userId, req.params.bookId];
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

const removeFromLikes = (req, res) => {
    const sql = "DELETE FROM likes WHERE user_id = ? AND book_id = ?";
    const values = [req.body.userId, req.params.bookId];
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
    );
};

module.exports = {
    addToLikes,
    removeFromLikes
};