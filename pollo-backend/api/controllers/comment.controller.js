var CommentService = require('../../services/comment.service');
var AppError = require('../../models/appError.model');

class CommentController {
    constructor() {
        this.commentService = new CommentService();
    }

    async getComment(req, res) {
        try{
            let commentInfo = await this.commentService.getComment(req.params.id);
            res.status(200).send(commentInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }

    }

    async getComments(req, res) {
        try{
            let commentInfo = await this.commentService.getComments();
            res.status(200).send(commentInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }

    }

    async newComment(req, res) {
        try{
            let createdComment = await this.commentService.newComment(req.body);
            res.status(200).send(createdComment);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async updateComment(req, res) {
        try{
            let postInfo = await this.commentService.updateComment(req.body);
            res.status(200).send(postInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async likeComment(req, res) {
        try{
            let postInfo = await this.commentService.likeComment(req);
            res.status(200).send(postInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }
}

var commentController = new CommentController();
module.exports = {
    getComment: function(req, res) { commentController.getComment(req, res); },
    getComments: function(req, res) { commentController.getComments(req, res); },
    newComment: function(req, res) { commentController.newComment(req, res); },
    updateComment: function(req, res) { commentController.updateComment(req, res); },
    likeComment: function(req, res) { commentController.likeComment(req, res); }
}
