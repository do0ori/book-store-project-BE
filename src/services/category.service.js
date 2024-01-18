const getAllCategory = async (conn) => {
    const sql = "SELECT * FROM category";
    const [rows] = await conn.query(sql);

    return rows;
};

module.exports = {
    getAllCategory
};