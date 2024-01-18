const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authorization.middleware');
const validator = require('../middlewares/validation.middleware');
const {
    addToLikes,
    removeFromLikes
} = require('../controllers/like.controller');

router.use(verifyToken(authMode = 'hard'));
router.post('/:bookId', validator.addToLikes, addToLikes);
router.delete('/:bookId', validator.removeFromLikes, removeFromLikes);

module.exports = router;