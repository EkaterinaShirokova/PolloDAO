"use strict"

var AppError = require('../models/appError.model');
var globalSettingsModel = require('../models/global-settings.model');
var userModel = require('../models/user.model');
const { MongoClient, ObjectID } = require('mongodb');
const express = require('express');
const saltRounds = 10;

module.exports = class GlobalSettingsService {

  constructor() {
  }

  async updateGlobalSettings(data) {
    let userData = await userModel.findOne({
      userId: data.userId
    });
    let globalSettingsData = null;
    if (userData != null && userData._doc.userRole.toLowerCase() == "leader") {
      globalSettingsData = await globalSettingsModel.findOne();
      if(globalSettingsData == null){
        let setttingsData = {};
        if(data.loginRequirement){
          setttingsData.loginRequirement = data.loginRequirement;
        }
        if(data.proposalRequirement){
          setttingsData.proposalRequirement = data.proposalRequirement;
        }
        setttingsData.editedBy = [];
        setttingsData.editedBy.push({
          "userId": data.userId
        })
        globalSettingsData = await globalSettingsModel.create(setttingsData);
      } else{
       // globalSettingsData = data;
        if(data.loginRequirement){
          globalSettingsData.loginRequirement = data.loginRequirement;
        }
        if(data.proposalRequirement){
          globalSettingsData.proposalRequirement = data.proposalRequirement;
        }
        if(globalSettingsData.editedBy.length == 5){
          globalSettingsData.editedBy.splice(0, 1);
        }
        
          globalSettingsData.editedBy.push({
            "userId": data.userId
          })
        await globalSettingsData.save();
      }
    }
    return {
      success: globalSettingsData != null,
      result: globalSettingsData
    }
  }


  async getGlobalSettings() {
    let result = await globalSettingsModel.find();
    return {
      success: result != null,
      result: result
    }
  }
}
