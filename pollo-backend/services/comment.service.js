"use strict"

var AppError = require('../models/appError.model');
var commentModel = require('../models/comment.model');
const { MongoClient, ObjectID } = require('mongodb');
const express = require('express');

module.exports = class CommentService {

    constructor() {
    }

    async newComment(data) {
      data.created = Date.now();
      let result = await commentModel.create(data);
      return {
        success: true,
        result: result
      }
    }

    async updateComment(data) {
      let commentData = await commentModel.findOne({post_id: data.post_id});
      commentData.text = data.text;
      commentData.commented_by = data.commented_by;
      commentData.modified = Date.now();
      let result = await commentData.save();
      return {
        success: result != null,
        result: result
      }
    }

    async likeComment(data) {
      let commentData = await commentModel.findOne({
        _id: ObjectID(data.body.id)
      });
      let user_index = typeof commentData.liked == "undefined" || !commentData.liked? -1 : commentData.liked.findIndex(r => r.userId == data.body.userId);
      if(user_index == -1 && data.body.liked){
        if(typeof commentData.liked == "undefined" || !commentData.liked){
          commentData.liked = [];
        }
        commentData.liked.push({userId: data.body.userId});
      }
      if(user_index > -1 && !data.body.liked){
        commentData.liked.splice(user_index, 1);
      }
      let result = await commentData.save();
      return {
        success: result != null,
        result: result
      }
    }

    async getComment(id) {
      let result = await commentModel.findOne({_id: new ObjectID(id)});
      return {
        success: result != null,
        result: result
      }
    }

    async getComments() {
      let result = await commentModel.find();
      return {
        success: result != null,
        result: result
      }
    }

}
