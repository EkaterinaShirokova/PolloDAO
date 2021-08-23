const express = require('express');
const commentController = require('../api/controllers/comment.controller');
const accountController = require('../api/controllers/account.controller');

const apiComment = express.Router();

apiComment.get('/comment-info/:id', commentController.getComment);
apiComment.get('/comment-info-all/', commentController.getComments);
apiComment.post('/new-comment', accountController.authenticateToken, commentController.newComment);
apiComment.put('/update-comment', accountController.authenticateToken, commentController.updateComment);
apiComment.put('/like-comment', commentController.likeComment); //accountController.authenticateToken,


module.exports = apiComment;
