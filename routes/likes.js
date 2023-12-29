const express = require('express');
const router = express.Router();

const likeBook = (req, res) => {
    res.json("좋아요 추가");
};

const unlikeBook = (req, res) => {
    res.json("좋아요 취소");
};

router.route('/:bookId')
    .post(likeBook)
    .delete(unlikeBook);

module.exports = router;