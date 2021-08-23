const express = require('express');
const postController = require('../api/controllers/post.controller');
const accountController = require('../api/controllers/account.controller');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.UPLOAD_PATH)
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname)
    }
});
var upload = multer({ storage: storage });

const apiPost = express.Router();

apiPost.get('/post-info/:id', postController.getPost);
apiPost.get('/post-info-all', postController.getPosts);
apiPost.get('/post-info-by-address/:address', postController.getPostsByAddress);
apiPost.post('/new-post',upload.single('postfile'),accountController.authenticateToken, postController.newPost);
apiPost.put('/update-post', upload.single('postfile'), accountController.authenticateToken, postController.updatePost);
apiPost.put('/like-post', accountController.authenticateToken, postController.likePost);
apiPost.delete('/delete-post', accountController.authenticateToken, postController.deletePost);
apiPost.get('/file/:id', postController.downloadPostAttachment);
apiPost.get('/attachment-preview/:id', postController.previewPostAttachment);


module.exports = apiPost;
