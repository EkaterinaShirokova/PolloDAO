"use strict"

var AppError = require('../models/appError.model');
var postModel = require('../models/post.model');
var commentModel = require('../models/comment.model');
var userModel = require('../models/user.model');
const { MongoClient, ObjectID } = require('mongodb');
const express = require('express');
const fs = require('fs');
const saltRounds = 10;

module.exports = class PostService {

    constructor() {
    }

    async newPost(data) {
      data.created = Date.now();
      let result = await postModel.create({
        address: data.body.address,
        userHandle: data.body.userHandle,
        title: data.body.title,
        body: data.body.body,
        filepath: data.file? data.file.path : ""
      });
      return {
        success: true,
        result: result
      }
    }

    async updatePost(data) {
      let postData = await postModel.findOne({
        address: data.body.address,
        _id: ObjectID(data.body.id)
      });
      postData.title = data.body.title? data.body.title : postData._doc.title;
      postData.body = data.body.body? data.body.body: postData._doc.body;
      postData.modified = Date.now();
      if(data.file){
        if(postData._doc.filepath){
          fs.unlinkSync(postData._doc.filepath);
        } else {

        }
        postData.filepath = data.file.path;
      }
      let result = await postData.save();
      return {
        success: result != null,
        result: result
      }
    }

    async likePost(data) {
      let postData = await postModel.findOne({
        _id: ObjectID(data.body.id)
      });
      let user_index = typeof postData.liked == "undefined" || !postData.liked? -1 : postData.liked.findIndex(r => r.userId == data.body.userId);
      if(user_index == -1 && data.body.liked){
        if(typeof postData.liked == "undefined" || !postData.liked){
          postData.liked = [];
        }
        console.log(postData.liked)
        postData.liked.push({userId: data.body.userId});
      }
      if(user_index > -1 && !data.body.liked){
        postData.liked.splice(user_index, 1);
      }
      let result = await postData.save();
      return {
        success: result != null,
        result: result
      }
    }
    
    async deletePost(data) {
      let result = await postModel.findOneAndDelete({
        address: data.address,
        _id: ObjectID(data.id)
      });
      if(result){
        try{
          let deleteResponse = await commentModel.deleteMany({
            post_id: (data.id)
          });
          fs.unlinkSync(result._doc.filepath);
        } catch(e){
          console.log(e);
        }
      }
      return {
        success: result != null,
        result: result
      }
    }

    async getPost(id) {
      let result = await postModel.findOne({_id: new ObjectID(id)});
      let comments = null;
      let user = null;
      let commenters = null;
      let usersClause = [];
      if(result){
        comments = await commentModel.find({post_id: id});
        user = await userModel.findOne({address: result._doc.address});
        if(typeof comments != "undefined" && comments){
            for(let i = 0; i < comments.length; i++){
              usersClause.push({address: comments[i]._doc.address});
            }
            commenters =  usersClause.length > 0? await userModel.find({ $or: usersClause}) : [];
            for(let i = 0; i < comments.length; i++){
              let commenter_index = commenters.findIndex(r => r.address == comments[i].address);
              let commenter = commenters[commenter_index];
              comments[i]._doc.userHandle = commenter.userHandle;
              comments[i]._doc.userRole = commenter.userRole;
              comments[i]._doc.avatar =  commenter.avatar && (commenter.avatar.data instanceof ArrayBuffer || commenter.avatar.data instanceof Buffer || commenter.avatar.data instanceof Array)? (Buffer.from(commenter.avatar.data,"base64")).toString() : null;
            }
            result._doc.comments = comments;
        }
        else{
            result._doc.comments = [];
        }
        if(typeof user != "undefined" && user){
          result._doc.userHandle = user._doc.userHandle;
          result._doc.userId = user._doc.userId;
          result._doc.userRole = user._doc.userRole;
          result._doc.avatar = user._doc.avatar && (user._doc.avatar.data instanceof ArrayBuffer || user._doc.avatar.data instanceof Buffer || user._doc.avatar.data instanceof Array)? (Buffer.from(user._doc.avatar.data,"base64")).toString() : null;
        }
        else{
          result._doc.userHandle = "";
          result._doc.avatar = "";
          result._doc.userId = "";
          result._doc.userRole = "";
        }
      }
      return {
        success: result != null,
        result: result
      }
    }

    async getPosts(keyword=null, page=null, page_size=null) {
      let result = await postModel.find(keyword? {
         $or: [{
             "title": { $regex: '.*' + keyword + '.*', '$options' : 'i' }
              }, {
                "body": { $regex: '.*' + keyword + '.*', '$options' : 'i' }
              }]
      } : {}).limit(page_size? parseInt(page_size) : null).skip(page && page_size? parseInt(page_size)*(parseInt(page) - 1) : null) ;
      let count = await postModel.countDocuments(keyword? {
         $or: [{
             "title": { $regex: '.*' + keyword + '.*', '$options' : 'i' }
              }, {
                "body": { $regex: '.*' + keyword + '.*', '$options' : 'i' }
              }]
      } : {});
      let userWhereClause = [];
      let commentsWhereClause = [];
      result.forEach(function(post, index){
        userWhereClause.push({address: post._doc.address});
        commentsWhereClause.push({post_id: post._doc._id});
        result[index]._doc.comments = [];
      });
      if(result.length == 0){
        return {
          success: true,
          result: result
        }
      }
      let comments = await commentModel.find({ $or: commentsWhereClause});
      let users = await userModel.find({ $or: userWhereClause});

      userWhereClause = [];
      comments.forEach(function(comment){
        userWhereClause.push({address: comment._doc.address});
      });
      let usersPerComment = userWhereClause.length > 0? await userModel.find({ $or: userWhereClause}):[];
      comments.forEach(function(comment, index){
        let locationIndex = usersPerComment.findIndex(r => r._doc.address == comment._doc.address);
        let locationIndexResult = result.findIndex(r => r._doc._id.toString() === (comment._doc.post_id));
        if(locationIndex > -1){
          let userData = usersPerComment[locationIndex]._doc;
          comments[index]._doc.avatar = userData.avatar && (userData.avatar.data instanceof ArrayBuffer || userData.avatar.data instanceof Buffer || userData.avatar.data instanceof Array)? (Buffer.from(userData.avatar.data,"base64")).toString() : null;
        }
        if(locationIndexResult > -1){
          result[locationIndexResult]._doc.comments.push(comment);
        }
      });

      result.forEach(function(post, index){
        let locationIndex = users.findIndex(r => r._doc.address == post._doc.address);
        if(locationIndex > -1){
          let userData = users[locationIndex]._doc;
          result[index]._doc.avatar = userData.avatar && (userData.avatar.data instanceof ArrayBuffer || userData.avatar.data instanceof Buffer || userData.avatar.data instanceof Array)? (Buffer.from(userData.avatar.data,"base64")).toString() : null;
          result[index]._doc.userId = userData.userId;
          result[index]._doc.userRole = userData.userRole;
        }
      });

      return {
        success: result != null,
        result: result,
        total_page: parseInt(Math.ceil(count/(page_size? page_size : 20)))
      }
    }

    async getPostsByAddress(address) {
      let result = await postModel.find({address: address});
      let user = await userModel.findOne({address: address});
      result.forEach(function(post, index){
        result[index]._doc.user = user
      });
      return {
        success: result != null,
        result: result
      }
    }

    async getAttachedPostFile(id) {
      let result = await postModel.findOne({_id: new ObjectID(id)});
      if(result != null && result._doc.filepath && result._doc.filepath != "") {
        return result._doc.filepath
      }
      return "";
    }
}
