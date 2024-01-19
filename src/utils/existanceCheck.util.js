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

/**
 * Checks whether a like record exists for a given user and book.
 * @param {Object} conn - The database connection object.
 * @param {number} userId - The ID of the user.
 * @param {number} bookId - The ID of the book.
 * @returns {Promise<boolean>} A promise that resolves to a boolean indicating whether the like record exists (true) or not (false).
 */
const isLikeExist = async (conn, userId, bookId) => {
    const sql = "SELECT EXISTS (SELECT 1 FROM likes WHERE user_id = ? AND book_id = ?) AS exist";
    const values = [userId, bookId];
    const [result] = await conn.query(sql, values);

    return result[0].exist === 1;
};

module.exports = {
    isUserExist,
    isLikeExist
};