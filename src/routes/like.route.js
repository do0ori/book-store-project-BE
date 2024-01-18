const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authorization.middleware');
const validator = require('../middlewares/validation.middleware');
const likeController = require('../controllers/like.controller');

router.use(verifyToken(authMode = 'hard'));
router.post('/:bookId', validator.addToLikes, likeController.addToLikes);
router.delete('/:bookId', validator.removeFromLikes, likeController.removeFromLikes);

module.exports = router;