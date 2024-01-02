const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const booksRequestHandler = (req, res) => {
    // 추후 express-validator 사용 (지금은 간단히 분기 로직 구현)
    const { categoryId, new:isNew } = req.query;
    if (categoryId || isNew) {
        getBooksByCategory(req, res);
    } else {
        getAllBooks(req, res);
    }
};

const getAllBooks = (req, res) => {
    res.json("전체 도서 조회");
};

const getBookById = (req, res) => {
    res.json("개별 도서 조회");
};

const getBooksByCategory = (req, res) => {
    res.json("카테고리별 도서 목록 조회");
};

module.exports = {
    booksRequestHandler,
    getBookById
};