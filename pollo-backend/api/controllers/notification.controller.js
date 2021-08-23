var NotificationService = require('../../services/notification.service');
var AppError = require('../../models/appError.model');

class NotificationController {
    constructor() {
        this.notificationService = new NotificationService();
    }

    async getNotification(req, res) {
        try{
            let notificationInfo = await this.notificationService.getNotification(req.params.id)
            res.status(200).send(notificationInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }

    }

    async updateNotification(req, res) {
        try{
            let notificationInfo = await this.notificationService.updateNotification(req.body);
            res.status(200).send(notificationInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async updateNotificationArray(req, res) {
        try{
            let notificationInfo = await this.notificationService.updateNotificationArray(req.params.id, req.params.index);
            res.status(200).send(notificationInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async clearAllNotifications(req, res) {
        try{
            let notificationInfo = await this.notificationService.clearAllNotifications(req.params.id);
            res.status(200).send(notificationInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }

    async deleteNotification(req, res) {
        try{
            let notificationInfo = await this.notificationService.deleteNotification(req.params.id);
            res.status(200).send(notificationInfo);
        } catch(e){
            console.log(e);
            res.status(500).json({code: AppError.UNKNOWN, message: "An internal server error has occurred"});
        }
    }
}

var notificationController = new NotificationController();
module.exports = {
    getNotification: function(req, res) { notificationController.getNotification(req, res); },
    updateNotification: function(req, res) { notificationController.updateNotification(req, res); },
    updateNotificationArray: function(req, res) { notificationController.updateNotificationArray(req, res); },
    clearAllNotifications: function(req, res) { notificationController.clearAllNotifications(req, res); },
    deleteNotification: function(req, res) { notificationController.deleteNotification(req, res); }
}
