var RoleService = require('../../services/roles.service');
var AppError = require('../../models/appError.model');

class RoleController {
    constructor() {
        this.roleService = new RoleService();
    }

    async getRole(req, res) {
        try{
            let roleInfo = await this.roleService.getRoles(req.params.role);
            res.status(200).send(roleInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }

    }

    async getRoles(req, res) {
        try{
            let roleInfo = await this.roleService.getRoles();
            res.status(200).send(roleInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }

    }

    async newRole(req, res) {
        try{
            let createdRole = await this.roleService.newRole(req.body);
            res.status(200).send(createdRole);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async updateRole(req, res) {
        try{
            let roleInfo = await this.roleService.updateRole(req.body);
            res.status(200).send(roleInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }
}

var commentController = new RoleController();
module.exports = {
    getRole: function(req, res) { commentController.getRole(req, res); },
    getRoles: function(req, res) { commentController.getRoles(req, res); },
    newRole: function(req, res) { commentController.newRole(req, res); },
    updateRole: function(req, res) { commentController.updateRole(req, res); }
}
