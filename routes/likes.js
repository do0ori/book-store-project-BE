const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/tokenVerification');
const validator = require('../middlewares/validation');
const {
    addToLikes,
    removeFromLikes
} = require('../controllers/likeController');

router.use(verifyToken(authMode = 'hard'));
router.post('/:bookId', validator.addToLikes, addToLikes);
router.delete('/:bookId', validator.removeFromLikes, removeFromLikes);

module.exports = router;