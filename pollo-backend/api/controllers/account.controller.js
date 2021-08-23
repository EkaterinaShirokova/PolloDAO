var AccountService = require('../../services/account.service');
var AppError = require('../../models/appError.model');

class AccountController {
    constructor() {
        this.accountService = new AccountService();
    }

    async getUserInfo(req, res) {
        try{
            let userInfo = await this.accountService.getUserInfo(req.params.id)
            res.status(userInfo.success? 200 : 400).send(userInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }

    }

    async filterUsers(req, res) {
        try{
            let userInfo = await this.accountService.filterUsers(req.query);
            res.status(userInfo.success? 200 : 400).send(userInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async getUsers(req, res) {
        try{
            let userInfo = await this.accountService.getUsers();
            res.status(userInfo.success? 200 : 400).send(userInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async login(req, res) {
        try{
            let loginInfo = await this.accountService.login(req.body.address);
            res.status(200).send(loginInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async registerUser(req, res) {
        try{
            let newUser = await this.accountService.registerUser(req);
            res.status(newUser.success? 200 : 400).send(newUser);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async updateUser(req, res) {
        try{
            let userInfo = await this.accountService.updateUser(req.body);
            res.status(userInfo.success? 200 : 400).send(userInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async authenticateToken(req, res, next){
      this.accountService.authenticateToken(req, res, next)
    }

    async deleteToken(req, res){
        try{
            let userInfo = await this.accountService.deleteToken(req.headers);
            res.status(200).send(userInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }
}

var accountController = new AccountController();
module.exports = {
    login: function(req, res) { accountController.login(req, res); },
    getUserInfo: function(req, res) { accountController.getUserInfo(req, res); },
    getUsers: function(req, res) { accountController.getUsers(req, res); },
    filterUsers: function(req, res) { accountController.filterUsers(req, res); },
    registerUser: function(req, res) { accountController.registerUser(req, res); },
    updateUser: function(req, res) { accountController.updateUser(req, res); },
    authenticateToken: function(req, res, next) { accountController.authenticateToken(req, res, next); },
    deleteToken: function(req, res) { accountController.deleteToken(req, res); }
}
