const express = require('express');
const router = express.Router();
const verifyToken = require('../utils/tokenVerification');
const {
    addToLikes,
    removeFromLikes
} = require('../controllers/likeController');

router.use(verifyToken(authMode = 'hard'));
router.post('/:bookId', addToLikes);
router.delete('/:bookId', removeFromLikes);

module.exports = router;