"use strict"

var AppError = require('../models/appError.model');
var rolesModel = require('../models/roles.model');
const { MongoClient, ObjectID } = require('mongodb');
const express = require('express');

module.exports = class RoleService {

    constructor() {
    }

    async newRole(data) {
      let result = await rolesModel.create(data);
      return {
        success: true,
        result: result
      }
    }

    async updateRole(data) {
      let roleData = await rolesModel.findOne({role: data.role});
      roleData.role = data.role;
      roleData.userId = data.userId? data.userId : roleData._doc.userId;
      roleData.userHandle = data.userHandle? data.userHandle : roleData._doc.userHandle;
      roleData.address = data.address? data.address : roleData._doc.address;
      let result = await roleData.save();
      return {
        success: result != null,
        result: result
      }
    }

    async getRole(role) {
      let result = await rolesModel.findOne({role: role});
      return {
        success: result != null,
        result: result
      }
    }

    async getRoles() {
      let result = await rolesModel.find();
      return {
        success: result != null,
        result: result
      }
    }

}
