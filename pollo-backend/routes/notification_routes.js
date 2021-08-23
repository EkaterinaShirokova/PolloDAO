const express = require('express');
const notificationController = require('../api/controllers/notification.controller');
const accountController = require('../api/controllers/account.controller');

const apiNotification = express.Router();

apiNotification.get('/notifications/:id',accountController.authenticateToken, notificationController.getNotification);
apiNotification.post('/notifications',accountController.authenticateToken, notificationController.updateNotification);
apiNotification.put('/read-notification/:id/:index', notificationController.updateNotificationArray);
apiNotification.put('/clear-notification/:id', accountController.authenticateToken, notificationController.clearAllNotifications);
apiNotification.delete('/notifications/:id', accountController.authenticateToken, notificationController.deleteNotification);

module.exports = apiNotification;
