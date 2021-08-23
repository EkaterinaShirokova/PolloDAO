const express = require('express');
const accountController = require('../api/controllers/account.controller');
var multer = require('multer');
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "/c/Users/ADMIN/Desktop/MLS/uploads")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + ".png")
    }
});
var upload = multer({ storage: storage });

const apiAccount = express.Router();

apiAccount.get('/user-info/:id', accountController.authenticateToken, accountController.getUserInfo);
apiAccount.get('/all-users', accountController.getUsers);
apiAccount.get('/filter-users', accountController.filterUsers);
apiAccount.post('/login', accountController.login);
apiAccount.post('/logout', accountController.authenticateToken, accountController.deleteToken);
apiAccount.post('/new-user', accountController.registerUser);//, upload.single('avatar')
apiAccount.put('/update-user', accountController.authenticateToken, accountController.updateUser);//,upload.single('avatar')


module.exports = apiAccount;
