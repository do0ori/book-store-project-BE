const express = require('express');
const router = express.Router();
const {
    addToLikes,
    removeFromLikes
} = require('../controller/likeController');

router.post('/:bookId', addToLikes);
router.delete('/:bookId', removeFromLikes);

module.exports = router;