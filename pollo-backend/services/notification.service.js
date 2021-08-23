"use strict"

var AppError = require('../models/appError.model');
var notificationModel = require('../models/notification.model');
var userModel = require('../models/user.model');
const { MongoClient, ObjectID } = require('mongodb');
const express = require('express');
const saltRounds = 10;

module.exports = class PostService {

  constructor() {
  }

  async updateNotification(data) {
    let userData = await userModel.findOne({
      userId: data.userId
    });
    let notificationData = null;
    if (userData != null) {
      notificationData = await notificationModel.findOne({
        userId: data.userId
      });
      if (notificationData == null) {
        notificationData = await notificationModel.create({
          userId: data.userId,
          notifications: 1,
          isRead: false,
          notification_data: [{
            title: data.title,
            link: data.link,
            from: data.from,
            isRead: false
          }]
        });
      } else {
        notificationData.isRead = false;
        notificationData.notifications++;
        notificationData.notification_data.push({
          title: data.title,
          link: data.link,
          from: data.from,
          isRead: false
        });
        notificationData = await notificationData.save();
      }
    }
    return {
      success: notificationData != null,
      result: notificationData
    }
  }

  async updateNotificationArray(userId, index) {
    let userData = await userModel.findOne({
      userId: userId
    });
    let notificationData = null;
    if (userData != null) {
      notificationData = await notificationModel.findOne({
        userId: userId
      });
      if (notificationData != null) {
        notificationData.notification_data[index].isRead = true;
        notificationData.notifications--;
        if (notificationData.notifications === 0)
          notificationData.isRead = true;
        notificationData = await notificationData.save();
      } else {
      }
    }
    return {
      success: notificationData != null,
      result: notificationData
    }
  }


  async clearAllNotifications(userId) {
    let userData = await userModel.findOne({
      userId: userId
    });
    let notificationData = null;
    if (userData != null) {
      notificationData = await notificationModel.findOne({
        userId: userId
      });
      if (notificationData != null) {
        notificationData._doc.notification_data.forEach(function (notif, index) {
          notificationData.notification_data[index].isRead = true;
        });
        notificationData.notifications = 0;
        notificationData.isRead = true;
        notificationData = await notificationData.save();
      } else {
      }
    }
    return {
      success: notificationData != null,
      result: notificationData
    }
  }

  async deleteNotification(userId) {
    let result = await notificationModel.findOneAndDelete({
      userId: userId
    });
    return {
      success: result != null,
      result: result
    }
  }

  async getNotification(userId) {
    let result = await notificationModel.findOne({
      userId: userId
    });
    return {
      success: result != null,
      result: result != null ? result : {
        isRead: true,
        notifications: 0
      }
    }
  }
}
