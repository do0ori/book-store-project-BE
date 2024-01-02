const express = require('express');
const router = express.Router();
const {
    addToLikes,
    removeFromLikes
} = require('../controllers/likeController');

router.post('/:bookId', addToLikes);
router.delete('/:bookId', removeFromLikes);

module.exports = router;