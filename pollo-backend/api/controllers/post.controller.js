var PostService = require('../../services/post.service');
var AppError = require('../../models/appError.model');
var fs = require("fs");

class PostController {
    constructor() {
        this.postService = new PostService();
    }

    async getPosts(req, res) {
        try{
            let postInfo = await this.postService.getPosts(req.query.keyword? req.query.keyword : null,
               req.query.page? req.query.page : null,
               req.query.page_size? req.query.page_size : null)
            res.status(200).send(postInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }

    }

    async getPostsByAddress(req, res) {
        try{
            let postInfo = await this.postService.getPostsByAddress(req.params.address)
            res.status(200).send(postInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }

    }

    async getPost(req, res) {
        try{
            let postInfo = await this.postService.getPost(req.params.id)
            res.status(200).send(postInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }

    }

    async newPost(req, res) {
        try{
            let createdPost = await this.postService.newPost(req);
            res.status(200).send(createdPost);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async updatePost(req, res) {
        try{
            let postInfo = await this.postService.updatePost(req);
            res.status(200).send(postInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async likePost(req, res) {
        try{
            let postInfo = await this.postService.likePost(req);
            res.status(200).send(postInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async deletePost(req, res) {
        try{
            let postInfo = await this.postService.deletePost(req.body);
            res.status(200).send(postInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async downloadPostAttachment(req, res) {
        try{
            let filepath = await this.postService.getAttachedPostFile(req.params.id);
            if(filepath != ""){
                res.download(filepath); 
            } else {
              res.status(400).send({sucess: false});
            }
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async previewPostAttachment(req, res) {
        try{
            let filepath = await this.postService.getAttachedPostFile(req.params.id);
            if(filepath != ""){
                if(filepath.match(/.(jpg|jpeg|png|gif)$/i)){
                    //res.sendFile(filepath)
                    res.status(200).send("data:image/"+ filepath.substring(filepath.length - 3) + ";base64," + fs.readFileSync(filepath).toString('base64'));
                } else{
                    res.status(200).send(""); 
                }
            } else {
              res.status(400).send({sucess: false});
            }
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }
}

var postController = new PostController();
module.exports = {
    getPost: function(req, res) { postController.getPost(req, res); },
    getPosts: function(req, res) { postController.getPosts(req, res); },
    getPostsByAddress: function(req, res) { postController.getPostsByAddress(req, res); },
    newPost: function(req, res) { postController.newPost(req, res); },
    updatePost: function(req, res) { postController.updatePost(req, res); },
    likePost: function(req, res) { postController.likePost(req, res); },
    deletePost: function(req, res) { postController.deletePost(req, res); },
    downloadPostAttachment: function(req, res) { postController.downloadPostAttachment(req, res); },
    previewPostAttachment: function(req, res) { postController.previewPostAttachment(req, res); }
}
