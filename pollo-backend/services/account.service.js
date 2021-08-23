"use strict"

var AppError = require('../models/appError.model');
var userModel = require('../models/user.model');
var postModel = require('../models/post.model');
var commentModel = require('../models/comment.model');
const { MongoClient, ObjectID } = require('mongodb');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const redis = require('redis');
// const JWTR =  require('jwt-redis').default;
// const redisClient = redis.createClient();
// const jwtr = new JWTR(redisClient);
const path = require('path');
const fs = require('fs');
const saltRounds = 10;


module.exports = class AccountService {

    constructor() {
    }

    async registerUser(data) {
      let user = await userModel.findOne({address: data.body.address});
      if(user != null){
        return {
          success: false,
          result: 'User exist'
        }
      }
      var userInfo = {
        address: data.body.address,
        userId: data.body.userId,
        userHandle: data.body.userHandle,
        userRole: data.body.userRole,
        userDesc: data.body.userDesc,
        avatar: typeof data.body.avatar != "undefined"? {
            data: Buffer.from(data.body.avatar),
            contentType: 'image/png'
        }: null
      }
      let result = await userModel.create(userInfo);
      return {
        success: true,
        result: result
      }
    }

    async updateUser(data) {
      let userData = await userModel.findOne({userId: data.userId});
      //userData.address = data.address;
      //userData.userId = typeof data.userId != "undefined"? data.userId : userData.userId;
      userData.userHandle = typeof data.userHandle != "undefined"? data.userHandle : userData.userHandle;
      userData.userRole = typeof data.userRole != "undefined"? data.userRole : userData.userRole;
      userData.userDesc = typeof data.userDesc != "undefined"? data.userDesc : userData.userDesc;
      userData.banLevel = typeof data.banLevel != "undefined"? data.banLevel : userData.banLevel;
      userData.bannedTime = typeof data.bannedTime != "undefined"? data.bannedTime : userData.bannedTime;
      userData.avatar = typeof data.avatar != "undefined"? {
          data: Buffer.from(data.avatar),
          contentType: 'image/png'
      } : userData.avatar;
      let result = await userData.save();
      if(result && result._doc ){
      result._doc.avatar = result._doc.avatar && (result._doc.avatar.data instanceof ArrayBuffer || result._doc.avatar.data instanceof Buffer || result._doc.avatar.data instanceof Array)? (Buffer.from(result._doc.avatar.data,"base64")).toString() : null;
      }
      return {
        success: true,
        result: result
      }
    }

    async getUserInfo(address) {
      let result = await userModel.findOne({address: address});
      if(result && result._doc){
        result._doc.avatar = result._doc.avatar && (result._doc.avatar.data instanceof ArrayBuffer || result._doc.avatar.data instanceof Buffer || result._doc.avatar.data instanceof Array)? (Buffer.from(result._doc.avatar.data,"base64")).toString() : null;
        let postData = await postModel.findOne({
          address: address
        }).select('modified -_id').sort({ modified: 1 });
        let commentData = await commentModel.findOne({
          address: address
        }).select('modified -_id').sort({ modified: 1 });
        if(postData && commentData){
          if(postData.modified.getTime() > commentData.modified.getTime()){
            result._doc.latestActivityTime = postData.modified;
          } else if(commentData.modified.getTime() > postData.modified.getTime()){
            result._doc.latestActivityTime = commentData.modified;
          }
        } else if(postData && !commentData){
          result._doc.latestActivityTime = postData.modified;
        } else if(!postData && commentData){
          result._doc.latestActivityTime = commentData.modified;
        } else {
          result._doc.latestActivityTime = null;
        }
      }
      return {
        success: true,
        result: result
      }
    }

    async getUsers() {
      let result = await userModel.find();
      result.forEach(function(data, index){
        let rawData = result[index];
        result[index]._doc.avatar = rawData._doc.avatar && (rawData._doc.avatar.data instanceof ArrayBuffer || rawData._doc.avatar.data instanceof Buffer || rawData._doc.avatar.data instanceof Array)? (Buffer.from(rawData._doc.avatar.data,"base64")).toString() : null;
      });
      return {
        success: result != null,
        result: result
      }
    }

    async filterUsers(query) {
      let whereClause = {};
      let limitClause = {};
      let result = null;
      if(query.isbanned == "true"){
          whereClause.banLevel = { $gt: 0 }
      }
      if(typeof query.keyword != "undefined" & query.keyword != null){
        whereClause.userId = { $regex: '.*' + query.keyword + '.*', '$options' : 'i' };
      }
      if(typeof query.size != "undefined" & query.size != null){
        limitClause = { limit: parseInt(query.size) }
      }
      console.log(whereClause)
      result = await userModel.find(whereClause, null, limitClause);
      result.forEach(function(data, index){
        let rawData = result[index];
        result[index]._doc.avatar = rawData._doc.avatar && (rawData._doc.avatar.data instanceof ArrayBuffer || rawData._doc.avatar.data instanceof Buffer || rawData._doc.avatar.data instanceof Array)? (Buffer.from(rawData._doc.avatar.data,"base64")).toString() : null;
      });
      return {
        success: result != null,
        result: result
      }
    }

    async login(address) {
        let success = false;
        let result = await userModel.findOne({address: address});
        if(result != null){
          success = true;
          result._doc.avatar = result._doc.avatar && (result._doc.avatar.data instanceof ArrayBuffer || result._doc.avatar.data instanceof Buffer || result._doc.avatar.data instanceof Array)? (Buffer.from(result._doc.avatar.data,"base64")).toString() : null;
          result._doc["token"] = jwt.sign({address: address}, process.env.TOKEN_SECRET, { expiresIn: '7d' });
          //result._doc["token"] = await jwtr.sign({address: address}, process.env.TOKEN_SECRET, { expiresIn: '3h' });
          result._doc.avatar = result._doc.avatar && (result._doc.avatar.data instanceof ArrayBuffer || result._doc.avatar.data instanceof Buffer || result._doc.avatar.data instanceof Array)? (Buffer.from(result._doc.avatar.data,"base64")).toString() : null;
        }
        return {
          success: success,
          result: success? result : null
        }
    }

    authenticateToken(req, res, next) {
      // const authHeader = req.headers['authorization']
      // const token = authHeader && authHeader.split(' ')[1]

      // if (token == null) return res.sendStatus(401)
      // jwtr.verify(token, process.env.TOKEN_SECRET).then((t)=>{
      //   next()
      // }).catch((err)=>{
      //   return res.sendStatus(403)
      // })

      const authHeader = req.headers['authorization']
      const token = authHeader && authHeader.split(' ')[1]

      if (token == null) return res.sendStatus(401)
      jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err)

        if (err) return res.sendStatus(403)

        req.user = user

        next()
      })
    }

    async deleteToken (headers) {
      try {
          let token = headers.authorization.slice(7, headers.authorization.length);
          let tokenDetails = await jwtr.verify(token, process.env.TOKEN_SECRET);
          //await jwtr.destroy(tokenDetails.jti);
          return ({
              success: true,
              message: "User logged out"
          });
      } catch (err) {
          console.log(err)
          return ({
              success: false,
              message: "Invalid Token"
          });
      }
    }

}
