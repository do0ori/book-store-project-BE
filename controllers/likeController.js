const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');

const addToLikes = (req, res) => {
    res.json("좋아요 추가");
};

const removeFromLikes = (req, res) => {
    res.json("좋아요 취소");
};

module.exports = {
    addToLikes,
    removeFromLikes
};